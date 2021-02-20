import { submitSecondStepTeachersForm } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { ImageItem, MediaItemTypes } from 'public/common/common-wix-types';
import {
  SecondStepTeachersForm,
  SecondStepTeachersFormKey,
  TeacherView,
} from 'public/common/entities/teacher';
import { normalizeSecondStepTeacherFormInput } from 'public/common/normalize-inputs/second-step-teacher-form-inputs';
import { secondStepTeachersFormSchema } from 'public/common/schemas/teacher-schemas';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { idFromString } from 'public/forms';
import { refreshInitialState } from 'public/global-state';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
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
  teacher: TeacherView;
  fieldValues: SecondStepTeachersForm;
  validationMessages: ValidationMessages;
};

forCurrentTeacher(async ({ teacher }: InitialState) => {
  const fieldValues = pick(teacher, FORM_FIELDS);
  state = {
    teacher,
    fieldValues,
    validationMessages: transform(fieldValues, (acc, value, field: SecondStepTeachersFormKey) => {
      acc[field] = validateField(field, value, secondStepTeachersFormSchema, {
        updateValidationMessage: TEXT_INPUTS.includes(field),
      });
    }),
  };
  await assignCurrentTeacherProfileFormFields();
  deletePhotoOnClick();
  $w('#uploadPhotos' as 'UploadButton').onChange(() => uploadPhotos());
  $w('#submitButton' as 'Button').onClick(() => submitForm());
});

async function assignCurrentTeacherProfileFormFields() {
  setPhotosRepeaterData();

  RICH_TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'RichTextBox');
    $input.value = state.fieldValues[field];
    $input.onChange((event: $w.Event) => {
      return onInputChange(field, event);
    });
  });

  TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'TextInput');
    $input.value = state.fieldValues[field] as string;
    $input.onInput((event: $w.Event) => {
      return onInputChange(field, event);
    });
  });
}

function onInputChange(field: SecondStepTeachersFormKey, event: $w.Event) {
  const value = normalizeSecondStepTeacherFormInput(field, event.target.value);
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

function deletePhotoOnClick() {
  const $photos = $w('#photos' as 'Repeater');

  $photos.onItemReady(($item, data: PhotoRepeaterData) => {
    $item('#photosImage' as 'Image').src = data.image;
    const $deleteBox = $item('#photoDeleteBox' as 'Box');

    $deleteBox.onClick(() => {
      state.fieldValues.photos = state.fieldValues.photos.filter(
        (photo: ImageItem) => photo.src !== data.image
      );
      setPhotosRepeaterData();
    });
  });
}

function setPhotosRepeaterData() {
  const data: PhotoRepeaterData[] = state.fieldValues.photos.map((photo: ImageItem) => ({
    _id: idFromString(photo.src, btoa),
    image: photo.src,
  }));
  const $photos = $w('#photos' as 'Repeater');
  const $noPhotosText = $w('#noPhotosText' as 'Text');
  $photos.data = data;
  if (data.length) {
    $noPhotosText.collapse();
    $photos.expand();
  } else {
    $photos.collapse();
    $noPhotosText.expand();
  }
}

function uploadPhotos() {
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
        setPhotosRepeaterData();
      })
      .catch((uploadError) => {
        $uploadStatus.text = 'File upload error';
        console.error(`Error: ${uploadError.errorCode} ${uploadError.errorDescription}`);
      })
      .finally(() => {
        $uploadButton.buttonLabel = previousButtonLabel;
      });
  } else {
    $uploadStatus.text = 'Please choose files to upload';
  }
}

async function submitForm() {
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  $submissionStatus.text = 'Submitting ...';
  $submissionStatus.show();

  try {
    await submitSecondStepTeachersForm(state.fieldValues);
    $submissionStatus.text = 'Profile updated, redirecting to your profile...';
    await refreshInitialState();
    wixLocation.to(`/teacher/${state.teacher.slug}`);
  } catch (error) {
    $submissionStatus.text = `Update failed: ${error.message}`;
  }
}
