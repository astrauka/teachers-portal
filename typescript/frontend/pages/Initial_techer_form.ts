import {
  currentTeachersInfo,
  currentTeachersProfile,
  updateInitialTeachersProfile,
} from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { InitialTeacherForm, InitialTeacherFormKey } from 'public/common/entities/teachers-profile';
import { initialTeachersFormSchema } from 'public/common/schemas/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { objectFromArray } from 'public/forms';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

type ValidationMessages = { [key in InitialTeacherFormKey]: string };
const TEXT_INPUTS: InitialTeacherFormKey[] = ['phoneNumber', 'city', 'streetAddress'];
const DROPDOWNS: InitialTeacherFormKey[] = ['country', 'language'];
const FORM_INPUTS: InitialTeacherFormKey[] = [...TEXT_INPUTS, ...DROPDOWNS];
const FORM_FIELDS: InitialTeacherFormKey[] = [...FORM_INPUTS, 'profileImage'];
let state: {
  isProfileImageUploadedByUser: boolean;
  fieldValues: InitialTeacherForm;
  validationMessages: ValidationMessages;
};

$w.onReady(() =>
  forLoggedInUser(async () => {
    state = {
      isProfileImageUploadedByUser: false,
      fieldValues: objectFromArray<InitialTeacherForm>(FORM_FIELDS, ''),
      validationMessages: objectFromArray<ValidationMessages>(FORM_FIELDS, ''),
    };
    await setCurrentTeacherName($w);
    await assignCurrentTeacherProfileFormFields($w);
    $w('#uploadButton' as 'UploadButton').onChange(() => uploadProfileImage($w));
    $w('#submit' as 'Button').onClick(() => submitProfileInfoForm($w));
  })
);

async function assignCurrentTeacherProfileFormFields($w) {
  const teachersProfile = await currentTeachersProfile();
  if (teachersProfile) {
    state.fieldValues = pick(teachersProfile, FORM_FIELDS);
    state.isProfileImageUploadedByUser = true;
  } else {
    state.isProfileImageUploadedByUser = false;
    console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
  }
  state.validationMessages = transform(
    pick(state.fieldValues, FORM_INPUTS),
    (acc, value, field) => {
      acc[field] = validateField(field, value, initialTeachersFormSchema);
    }
  );

  $w('#profileImage' as 'Image').src = state.fieldValues.profileImage;
  FORM_INPUTS.forEach((field) => {
    $w(`#${field}` as 'FormElement').value = state.fieldValues[field];
  });

  TEXT_INPUTS.forEach((field) => {
    $w(`#${field}` as 'TextInput').onInput((event: $w.Event) => {
      return onInputChange(field, event, $w);
    });
  });

  DROPDOWNS.forEach((field) => {
    $w(`#${field}` as 'Dropdown').onChange((event: $w.Event) => {
      return onInputChange(field, event, $w);
    });
  });
}

function onInputChange(field: string, event: $w.Event, $w) {
  const value = event.target.value;
  state.fieldValues[field] = value;
  state.validationMessages[field] = validateField(field, value, initialTeachersFormSchema);
  const $submitButton = $w('#submit' as 'Button');
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  if (some(values(state.validationMessages))) {
    $submissionStatus.text = 'Please fill in all the fields';
    $submissionStatus.show();
    return $submitButton.disable();
  } else {
    $submissionStatus.text = '';
    $submissionStatus.hide();
    return $submitButton.enable();
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

function uploadProfileImage($w) {
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
  } else {
    $uploadStatus.text = 'Please choose a file to upload.';
  }
}

async function submitProfileInfoForm($w) {
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  $submissionStatus.text = 'Submitting ...';
  $submissionStatus.show();
  const updatedProfileImage = state.isProfileImageUploadedByUser && state.fieldValues.profileImage;

  try {
    await updateInitialTeachersProfile(state.fieldValues);
    $submissionStatus.text = 'Profile updated, redirecting to dashboard...';
    if (updatedProfileImage) {
      $w('#headerProfileImage' as 'Image').src = updatedProfileImage;
    }
    wixLocation.to('/dashboard');
  } catch (error) {
    $submissionStatus.text = `Update failed: ${error.message}`;
  }
}
