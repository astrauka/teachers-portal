import {
  currentTeachersInfo,
  currentTeachersProfile,
  updateTeachersProfile,
} from 'backend/backend-api';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { $W } from '../wix-types';

let isProfileImageUploadedByUser;

$w.onReady(async function () {
  await setCurrentTeacherName($w);
  await assignCurrentTeacherProfileFormFields($w);
  $w('#submit' as 'Button').onClick(() => submitProfileInfoForm($w));
});

async function assignCurrentTeacherProfileFormFields($w: $W) {
  const teachersProfile = await currentTeachersProfile();
  if (teachersProfile) {
    isProfileImageUploadedByUser = true;
    $w('#profileImage' as 'Image').src = teachersProfile.profileImage;
    $w('#phoneNumber' as 'TextInput').value = teachersProfile.phoneNumber;
    $w('#country' as 'TextInput').value = teachersProfile.country;
    $w('#city' as 'Dropdown').value = teachersProfile.city;
    $w('#streetAddress' as 'TextInput').value = teachersProfile.streetAddress;
    $w('#language' as 'Dropdown').value = teachersProfile.language;
  } else {
    isProfileImageUploadedByUser = false;
    console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
  }
}

async function setCurrentTeacherName($w: $W) {
  const teachersInfo = await currentTeachersInfo();
  if (teachersInfo) {
    $w('#teacherFullName' as 'Text').text = `${teachersInfo.firstName} ${teachersInfo.lastName}`;
  } else {
    console.error(`Could not load current teacher for ${await wixUsers.currentUser.getEmail()}`);
  }
}

export function uploadButton_change(event) {
  const $uploadButton = $w('#uploadButton' as 'UploadButton');
  const $uploadStatus = $w('#uploadStatus' as 'Text');
  if ($uploadButton.value.length > 0) {
    const previousButtonLabel = $uploadButton.buttonLabel;
    $uploadButton.buttonLabel = 'Uploading...';
    $uploadStatus.text = `Uploading ${$uploadButton.value[0].name}`;

    $uploadButton
      .startUpload()
      .then((uploadedFile) => {
        $uploadStatus.text = 'Upload successful';
        $w('#profileImage' as 'Image').src = uploadedFile.url;
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
  } else {
    $uploadStatus.text = 'Please choose a file to upload.';
  }
}

async function submitProfileInfoForm($w: $W) {
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  $submissionStatus.text = 'Submitting ...';
  $submissionStatus.show();
  const profileImage = isProfileImageUploadedByUser ? $w('#profileImage' as 'Image').src : '';

  try {
    const update = {
      profileImage,
      phoneNumber: $w('#phoneNumber' as 'TextInput').value,
      country: $w('#country' as 'Dropdown').value,
      city: $w('#city' as 'TextInput').value,
      streetAddress: $w('#streetAddress' as 'TextInput').value,
      language: $w('#language' as 'Dropdown').value,
    };
    await updateTeachersProfile(update);
    $submissionStatus.text = 'Profile updated.';
    $submissionStatus.hide('fade', { duration: 2000, delay: 1000 });
    if (profileImage) {
      $w('#headerProfileImage' as 'Image').src = profileImage;
    }
    wixLocation.to('/dashboard');
  } catch (error) {
    $submissionStatus.text = `Update failed: ${error.message}`;
  }
}
