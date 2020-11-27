import { currentTeachersInfo, currentTeachersProfile, updateTeachersProfile, } from 'backend/backend-api';
import { forLoggedInUser } from 'public/for-logged-in-user';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
let isProfileImageUploadedByUser;
$w.onReady(() => forLoggedInUser(async () => {
    await setCurrentTeacherName($w);
    await assignCurrentTeacherProfileFormFields($w);
    $w('#submit').onClick(() => submitProfileInfoForm($w));
}));
async function assignCurrentTeacherProfileFormFields($w) {
    const teachersProfile = await currentTeachersProfile();
    if (teachersProfile) {
        isProfileImageUploadedByUser = true;
        $w('#profileImage').src = teachersProfile.profileImage;
        $w('#phoneNumber').value = teachersProfile.phoneNumber;
        $w('#country').value = teachersProfile.country;
        $w('#city').value = teachersProfile.city;
        $w('#streetAddress').value = teachersProfile.streetAddress;
        $w('#language').value = teachersProfile.language;
    }
    else {
        isProfileImageUploadedByUser = false;
        console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
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
            isProfileImageUploadedByUser = true;
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
    const profileImage = isProfileImageUploadedByUser ? $w('#profileImage').src : '';
    try {
        const update = {
            profileImage,
            phoneNumber: $w('#phoneNumber').value,
            country: $w('#country').value,
            city: $w('#city').value,
            streetAddress: $w('#streetAddress').value,
            language: $w('#language').value,
        };
        await updateTeachersProfile(update);
        $submissionStatus.text = 'Profile updated.';
        $submissionStatus.hide('fade', { duration: 2000, delay: 1000 });
        if (profileImage) {
            $w('#headerProfileImage').src = profileImage;
        }
        wixLocation.to('/dashboard');
    }
    catch (error) {
        $submissionStatus.text = `Update failed: ${error.message}`;
    }
}
