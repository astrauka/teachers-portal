import { currentTeachersProfile, updateSecondStepTeachersProfile } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { MediaItemTypes } from 'public/common/common-wix-types';
import { secondStepTeachersFormSchema } from 'public/common/schemas/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { objectFromArray } from 'public/forms';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
const TEXT_INPUTS = [
    'facebook',
    'instagram',
    'linkedIn',
    'website',
    'about',
];
const FORM_FIELDS = [...TEXT_INPUTS, 'photos'];
const FIELDS_WITH_VALIDATION = [
    'facebook',
    'instagram',
    'linkedIn',
    'website',
];
let state;
$w.onReady(() => forLoggedInUser(async () => {
    state = {
        fieldValues: {
            ...objectFromArray(TEXT_INPUTS, ''),
            photos: [],
        },
        validationMessages: objectFromArray(FIELDS_WITH_VALIDATION, ''),
    };
    await assignCurrentTeacherProfileFormFields($w);
    $w('#uploadPhotos').onChange(() => uploadPhotos($w));
    $w('#submitButton').onClick(() => submitForm($w));
}));
async function assignCurrentTeacherProfileFormFields($w) {
    const teachersProfile = await currentTeachersProfile();
    if (teachersProfile) {
        state.fieldValues = pick(teachersProfile, FORM_FIELDS);
    }
    else {
        console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
    }
    state.validationMessages = transform(pick(state.fieldValues, FIELDS_WITH_VALIDATION), (acc, value, field) => {
        acc[field] = validateField(field, value, secondStepTeachersFormSchema);
    });
    if (state.fieldValues.photos.length) {
        $w('#photos').items = state.fieldValues.photos;
    }
    TEXT_INPUTS.forEach((field) => {
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onInput((event) => {
            return onInputChange(field, event, $w);
        });
    });
}
function onInputChange(field, event, $w) {
    const value = event.target.value;
    state.fieldValues[field] = value;
    if (FIELDS_WITH_VALIDATION.includes(field)) {
        state.validationMessages[field] = validateField(field, value, secondStepTeachersFormSchema);
    }
    const $submitButton = $w('#submitButton');
    const $submissionStatus = $w('#submissionStatus');
    if (some(values(state.validationMessages))) {
        $submissionStatus.text = 'Some fields are not valid';
        $submissionStatus.show();
        return $submitButton.disable();
    }
    else {
        $submissionStatus.text = '';
        $submissionStatus.hide();
        return $submitButton.enable();
    }
}
function uploadPhotos($w) {
    const $uploadButton = $w('#uploadPhotos');
    const $uploadStatus = $w('#uploadStatus');
    if ($uploadButton.value.length > 0) {
        const previousButtonLabel = $uploadButton.buttonLabel;
        $uploadButton.buttonLabel = 'Uploading...';
        $uploadStatus.text = `Uploading ${$uploadButton.value[0].name}`;
        $uploadButton
            .startUpload()
            .then((uploadedFile) => {
            $uploadStatus.text = 'Upload successful';
            const photo = {
                type: MediaItemTypes.IMAGE,
                src: uploadedFile.url,
                title: uploadedFile.title,
            };
            state.fieldValues.photos = [...state.fieldValues.photos, photo];
            $w('#photos').items = state.fieldValues.photos;
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
        $uploadStatus.text = 'Please choose files to upload';
    }
}
async function submitForm($w) {
    const $submissionStatus = $w('#submissionStatus');
    $submissionStatus.text = 'Submitting ...';
    $submissionStatus.show();
    try {
        await updateSecondStepTeachersProfile(state.fieldValues);
        $submissionStatus.text = 'Profile updated, redirecting to dashboard...';
        wixLocation.to('/dashboard');
    }
    catch (error) {
        $submissionStatus.text = `Update failed: ${error.message}`;
    }
}
