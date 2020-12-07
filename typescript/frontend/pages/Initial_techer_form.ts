import {
  currentTeachersInfo,
  currentTeachersProfile,
  updateTeachersProfile,
} from 'backend/backend-api';
import { isEmpty, pick, some } from 'lodash';
import { forLoggedInUser } from 'public/for-logged-in-user';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

const INITIAL_PROFILE_FIELDS = [
  'profileImage',
  'phoneNumber',
  'country',
  'city',
  'streetAddress',
  'language',
];
let isProfileImageUploadedByUser;

$w.onReady(() =>
  forLoggedInUser(async () => {
    await setCurrentTeacherName($w);
    await assignCurrentTeacherProfileFormFields($w);
    $w('#submit' as 'Button').onClick(() => submitProfileInfoForm($w));
  })
);

async function assignCurrentTeacherProfileFormFields($w) {
  const teachersProfile = await currentTeachersProfile();
  const values = pick(teachersProfile, INITIAL_PROFILE_FIELDS);
  if (teachersProfile) {
    isProfileImageUploadedByUser = true;
    $w('#profileImage' as 'Image').src = teachersProfile.profileImage;
    $w('#phoneNumber' as 'TextInput').value = teachersProfile.phoneNumber;
    $w('#country' as 'TextInput').value = teachersProfile.country;
    $w('#city' as 'Dropdown').value = teachersProfile.city;
    $w('#streetAddress' as 'TextInput').value = teachersProfile.streetAddress;
    $w('#language' as 'Dropdown').value = teachersProfile.language;
    INITIAL_PROFILE_FIELDS.forEach((field) => {
      $w(`#${field}` as 'TextInput').onChange((event: $w.Event) => {
        values[field] = event.target.value;
        console.warn(values);
        const $submitButton = $w('#submit' as 'Button');
        if (some(values, (value) => isEmpty(value))) {
          return $submitButton.disable();
        } else {
          return $submitButton.enable();
        }
      });
    });
  } else {
    isProfileImageUploadedByUser = false;
    console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
  }
}

async function setCurrentTeacherName($w) {
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

async function submitProfileInfoForm($w) {
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
