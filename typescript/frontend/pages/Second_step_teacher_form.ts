import { currentTeachersProfile, updateTeachersProfile } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { ImageItem } from 'public/common/common-wix-types';
import {
  SecondStepTeachersForm,
  SecondStepTeachersFormKey,
} from 'public/common/entities/teachers-profile';
import { secondStepTeachersFormSchema } from 'public/common/schemas/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { objectFromArray } from 'public/forms';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { MediaItemTypes } from '../../common/common-wix-types';
import UploadedFile = $w.UploadButton.UploadedFile;

type ValidationMessages = { [key in SecondStepTeachersFormKey]: string };
const TEXT_INPUTS: SecondStepTeachersFormKey[] = [
  'facebook',
  'instagram',
  'linkedIn',
  'website',
  'about',
];
const FORM_FIELDS: SecondStepTeachersFormKey[] = [...TEXT_INPUTS, 'photos'];
const FIELDS_WITH_VALIDATION: SecondStepTeachersFormKey[] = [
  'facebook',
  'instagram',
  'linkedIn',
  'website',
];
let state: {
  fieldValues: SecondStepTeachersForm;
  validationMessages: ValidationMessages;
};

$w.onReady(() =>
  forLoggedInUser(async () => {
    state = {
      fieldValues: {
        ...objectFromArray<SecondStepTeachersForm>(TEXT_INPUTS, ''),
        photos: [],
      },
      validationMessages: objectFromArray<ValidationMessages>(FIELDS_WITH_VALIDATION, ''),
    };
    await assignCurrentTeacherProfileFormFields($w);
    $w('#uploadPhotos' as 'Button').onClick(() => uploadPhotos($w));
    $w('#submitButton' as 'Button').onClick(() => submitForm($w));
  })
);

async function assignCurrentTeacherProfileFormFields($w) {
  const teachersProfile = await currentTeachersProfile();
  if (teachersProfile) {
    state.fieldValues = pick(teachersProfile, FORM_FIELDS);
  } else {
    console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
  }
  state.validationMessages = transform(
    pick(state.fieldValues, FIELDS_WITH_VALIDATION),
    (acc, value, field) => {
      acc[field] = validateField(field, value, secondStepTeachersFormSchema);
    }
  );

  $w('#photos' as 'Gallery').items = state.fieldValues.photos;

  TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'TextInput');
    $input.value = state.fieldValues[field];
    $input.onInput((event: $w.Event) => {
      return onInputChange(field, event, $w);
    });
  });
}

function onInputChange(field: SecondStepTeachersFormKey, event: $w.Event, $w) {
  const value = event.target.value;
  state.fieldValues[field] = value;
  if (field in FIELDS_WITH_VALIDATION) {
    state.validationMessages[field] = validateField(field, value, secondStepTeachersFormSchema);
  }
  const $submitButton = $w('#submitButton' as 'Button');
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  if (some(values(state.validationMessages))) {
    $submissionStatus.text = 'Some fields are not valid';
    $submissionStatus.show();
    return $submitButton.disable();
  } else {
    $submissionStatus.text = '';
    $submissionStatus.hide();
    return $submitButton.enable();
  }
}

function uploadPhotos($w) {
  const $uploadButton = $w('#uploadPhotos' as 'UploadButton');
  const $uploadStatus = $w('#uploadStatus' as 'Text');
  if ($uploadButton.value.length > 0) {
    const previousButtonLabel = $uploadButton.buttonLabel;
    $uploadButton.buttonLabel = 'Uploading...';
    $uploadStatus.text = `Uploading ${$uploadButton.value[0].name}`;

    $uploadButton
      .startUpload()
      .then((uploadedFile: UploadedFile) => {
        $uploadStatus.text = 'Upload successful';
        const photo: ImageItem = {
          type: MediaItemTypes.IMAGE,
          src: uploadedFile.url,
          title: uploadedFile.title,
        };
        state.fieldValues.photos = [...state.fieldValues.photos, photo];
        $w('#photos' as 'Gallery').items = state.fieldValues.photos;
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
    $uploadStatus.text = 'Please choose files to upload';
  }
}

async function submitForm($w) {
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  $submissionStatus.text = 'Submitting ...';
  $submissionStatus.show();

  try {
    await updateTeachersProfile(state.fieldValues);
    $submissionStatus.text = 'Profile updated, redirecting to dashboard...';
    wixLocation.to('/dashboard');
  } catch (error) {
    $submissionStatus.text = `Update failed: ${error.message}`;
  }
}
