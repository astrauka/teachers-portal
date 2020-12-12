import { currentTeachersInfo, currentTeachersProfile, updateTeachersProfile, } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { initialTeachersFormSchema } from 'public/common/schemas/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { objectFromArray } from 'public/forms';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
const TEXT_INPUTS = ['phoneNumber', 'city', 'streetAddress'];
const DROPDOWNS = ['country', 'language'];
const FORM_INPUTS = [...TEXT_INPUTS, ...DROPDOWNS];
const FORM_FIELDS = [...FORM_INPUTS, 'profileImage'];
let state;
$w.onReady(() => forLoggedInUser(async () => {
    state = {
        isProfileImageUploadedByUser: false,
        fieldValues: objectFromArray(FORM_FIELDS, ''),
        validationMessages: objectFromArray(FORM_FIELDS, ''),
    };
    await setCurrentTeacherName($w);
    await assignCurrentTeacherProfileFormFields($w);
    $w('#submit').onClick(() => submitProfileInfoForm($w));
}));
async function assignCurrentTeacherProfileFormFields($w) {
    const teachersProfile = await currentTeachersProfile();
    if (teachersProfile) {
        state.fieldValues = pick(teachersProfile, FORM_FIELDS);
        state.isProfileImageUploadedByUser = true;
    }
    else {
        state.isProfileImageUploadedByUser = false;
        console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
    }
    state.validationMessages = transform(pick(state.fieldValues, FORM_INPUTS), (acc, value, field) => {
        acc[field] = validateField(field, value, initialTeachersFormSchema);
    });
    $w('#profileImage').src = state.fieldValues.profileImage;
    FORM_INPUTS.forEach((field) => {
        $w(`#${field}`).value = state.fieldValues[field];
    });
    TEXT_INPUTS.forEach((field) => {
        $w(`#${field}`).onInput((event) => {
            return onInputChange(field, event, $w);
        });
    });
    DROPDOWNS.forEach((field) => {
        $w(`#${field}`).onChange((event) => {
            return onInputChange(field, event, $w);
        });
    });
}
function onInputChange(field, event, $w) {
    const value = event.target.value;
    state.fieldValues[field] = value;
    state.validationMessages[field] = validateField(field, value, initialTeachersFormSchema);
    const $submitButton = $w('#submit');
    const $submissionStatus = $w('#submissionStatus');
    if (some(values(state.validationMessages))) {
        $submissionStatus.text = 'Please fill in all the fields';
        $submissionStatus.show();
        return $submitButton.disable();
    }
    else {
        $submissionStatus.text = '';
        $submissionStatus.hide();
        return $submitButton.enable();
    }
}
async function setCurrentTeacherName($w) {
    const teachersInfo = await currentTeachersInfo();
    if (teachersInfo) {
        $w('#teacherFullName').text = `${teachersInfo.firstName} ${teachersInfo.lastName}`;
    }
    else {
        console.error(`Could not load current teacher for ${await wixUsers.currentUser.getEmail()}`);
    }
}
export function uploadButton_change(event) {
    const $uploadButton = $w('#uploadButton');
    const $uploadStatus = $w('#uploadStatus');
    if ($uploadButton.value.length > 0) {
        const previousButtonLabel = $uploadButton.buttonLabel;
        $uploadButton.buttonLabel = 'Uploading...';
        $uploadStatus.text = `Uploading ${$uploadButton.value[0].name}`;
        $uploadButton
            .startUpload()
            .then((uploadedFile) => {
            $uploadStatus.text = 'Upload successful';
            $w('#profileImage').src = uploadedFile.url;
            state.fieldValues.profileImage = uploadedFile.url;
            state.validationMessages.profileImage = '';
            state.isProfileImageUploadedByUser = true;
        })
            .catch((uploadError) => {
            $uploadStatus.text = 'File upload error';
            console.error(`Error: ${uploadError.errorCode}`);
            console.error(uploadError.errorDescription);
        })
            .finally(() => {
            $uploadButton.buttonLabel = previousButtonLabel;
        });
    }
    else {
        $uploadStatus.text = 'Please choose a file to upload.';
    }
}
async function submitProfileInfoForm($w) {
    const $submissionStatus = $w('#submissionStatus');
    $submissionStatus.text = 'Submitting ...';
    $submissionStatus.show();
    const updatedProfileImage = state.isProfileImageUploadedByUser && state.fieldValues.profileImage;
    try {
        await updateTeachersProfile(state.fieldValues);
        $submissionStatus.text = 'Profile updated, redirecting to dashboard...';
        $submissionStatus.hide('fade', { duration: 2000, delay: 1000 });
        if (updatedProfileImage) {
            $w('#headerProfileImage').src = updatedProfileImage;
        }
        wixLocation.to('/dashboard');
    }
    catch (error) {
        $submissionStatus.text = `Update failed: ${error.message}`;
    }
}
