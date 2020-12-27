import { currentTeachersProfile, updateSecondStepTeachersProfile } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { ImageItem, MediaItemTypes } from 'public/common/common-wix-types';
import {
  SecondStepTeachersForm,
  SecondStepTeachersFormKey,
  TeachersProfileView,
} from 'public/common/entities/teachers-profile';
import { secondStepTeachersFormSchema } from 'public/common/schemas/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { idFromString, objectFromArray } from 'public/forms';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import UploadedFile = $w.UploadButton.UploadedFile;

type ValidationMessages = { [key in SecondStepTeachersFormKey]: string };
interface PhotoRepeaterData {
  _id: string;
  image: string;
}

const TEXT_INPUTS: SecondStepTeachersFormKey[] = ['facebook', 'instagram', 'linkedIn', 'website'];
const RICH_TEXT_INPUTS: SecondStepTeachersFormKey[] = ['about'];
const FORM_FIELDS: SecondStepTeachersFormKey[] = [...TEXT_INPUTS, ...RICH_TEXT_INPUTS, 'photos'];
const FIELDS_WITH_VALIDATION: SecondStepTeachersFormKey[] = [
  'facebook',
  'instagram',
  'linkedIn',
  'website',
];
let state: {
  teachersProfile: TeachersProfileView | undefined;
  fieldValues: SecondStepTeachersForm;
  validationMessages: ValidationMessages;
};

$w.onReady(() =>
  forLoggedInUser(async () => {
    state = {
      teachersProfile: undefined,
      fieldValues: {
        ...objectFromArray<SecondStepTeachersForm>(TEXT_INPUTS, ''),
        photos: [],
      },
      validationMessages: objectFromArray<ValidationMessages>(FIELDS_WITH_VALIDATION, ''),
    };
    await assignCurrentTeacherProfileFormFields($w);
    deletePhotoOnClick($w);
    $w('#uploadPhotos' as 'UploadButton').onChange(() => uploadPhotos($w));
    $w('#submitButton' as 'Button').onClick(() => submitForm($w));
  })
);

async function assignCurrentTeacherProfileFormFields($w) {
  const teachersProfile = await currentTeachersProfile();
  if (!teachersProfile) {
    console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
    return wixLocation.to('initial-form');
  }

  state.teachersProfile = teachersProfile;
  state.fieldValues = pick(teachersProfile, FORM_FIELDS);
  state.validationMessages = transform(
    pick(state.fieldValues, FIELDS_WITH_VALIDATION),
    (acc, value, field) => {
      acc[field] = validateField(field, value, secondStepTeachersFormSchema);
    }
  );

  setPhotosRepeaterData($w);

  RICH_TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'RichTextBox');
    $input.value = state.fieldValues[field];
    $input.onChange((event: $w.Event) => {
      return onInputChange(field, event, $w);
    });
  });

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
  if (FIELDS_WITH_VALIDATION.includes(field)) {
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

function deletePhotoOnClick($w) {
  const $photos = $w('#photos' as 'Repeater');

  $photos.onItemReady(($item, data: PhotoRepeaterData) => {
    $item('#photosImage').src = data.image;
    const $deleteBox = $item('#photoDeleteBox' as 'Box');

    $deleteBox.onClick(() => {
      state.fieldValues.photos = state.fieldValues.photos.filter(
        (photo: ImageItem) => photo.src !== data.image
      );
      setPhotosRepeaterData($w);
    });
  });
}

function setPhotosRepeaterData($w) {
  const data: PhotoRepeaterData[] = state.fieldValues.photos.map((photo: ImageItem) => ({
    _id: idFromString(photo.src),
    image: photo.src,
  }));
  const $photos = $w('#photos' as 'Repeater');
  $photos.data = data;
  if (data.length) {
    $w('#noPhotosText').collapse();
    $photos.expand();
  } else {
    $photos.collapse();
    $w('#noPhotosText').expand();
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
        setPhotosRepeaterData($w);
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
    await updateSecondStepTeachersProfile(state.fieldValues);
    $submissionStatus.text = 'Profile updated, redirecting to your profile...';
    wixLocation.to(`/teacher/${state.teachersProfile.slug}`);
  } catch (error) {
    $submissionStatus.text = `Update failed: ${error.message}`;
  }
}
