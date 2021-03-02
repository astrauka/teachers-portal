import { submitInitialTeachersForm } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import {
  InitialTeacherForm,
  InitialTeacherFormKey,
  TeacherView,
} from 'public/common/entities/teacher';
import { initialTeachersFormSchema } from 'public/common/schemas/teacher-schemas';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { refreshInitialState } from 'public/global-state';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';

type ValidationMessages = { [key in InitialTeacherFormKey]: string };
const TEXT_INPUTS: InitialTeacherFormKey[] = ['phoneNumber', 'city'];
const DROPDOWNS: InitialTeacherFormKey[] = ['country', 'language'];
const FORM_INPUTS: InitialTeacherFormKey[] = [...TEXT_INPUTS, ...DROPDOWNS];
const FORM_FIELDS: InitialTeacherFormKey[] = [...FORM_INPUTS, 'profileImage'];
let state: {
  teacher: TeacherView;
  fieldValues: InitialTeacherForm;
  validationMessages: ValidationMessages;
};

forCurrentTeacher('initialTeacherForm', async ({ teacher }: InitialState) => {
  $w('#teacherFullName' as 'Text').text = teacher.fullName;
  const fieldValues = pick(teacher, FORM_FIELDS);
  state = {
    teacher,
    fieldValues,
    validationMessages: transform(fieldValues, (acc, value, field: InitialTeacherFormKey) => {
      acc[field] = validateField(field, value, initialTeachersFormSchema, {
        updateValidationMessage: FORM_INPUTS.includes(field),
      });
    }),
  };
  assignCurrentTeacherFormFields();
  $w('#uploadButton' as 'UploadButton').onChange(() => uploadProfileImage());
  $w('#submit' as 'Button').onClick(() => submitProfileInfoForm());
});

function assignCurrentTeacherFormFields() {
  enableSubmissionButton();

  if (state.fieldValues.profileImage) {
    $w('#profileImage' as 'Image').src = state.fieldValues.profileImage;
  }
  TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'TextInput');
    $input.value = state.fieldValues[field];
    $input.onInput((event: $w.Event) => onInputChange(field, event));
  });

  DROPDOWNS.forEach((field) => {
    const $dropdown = $w(`#${field}` as 'Dropdown');
    $dropdown.value = state.fieldValues[field];
    $dropdown.onChange((event: $w.Event) => onInputChange(field, event));
  });
}

function enableSubmissionButton(): void {
  const $submitButton = $w('#submit' as 'Button');
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  if (some(values(state.validationMessages))) {
    $submissionStatus.text = 'Please fill in all the fields';
    $submissionStatus.show();
    $submitButton.disable();
  } else {
    $submissionStatus.text = '';
    $submissionStatus.hide();
    $submitButton.enable();
  }
}

async function onInputChange(field: string, event: $w.Event): Promise<void> {
  const value = event.target.value;
  state.fieldValues[field] = value;
  state.validationMessages[field] = validateField(field, value, initialTeachersFormSchema);
  enableSubmissionButton();
}

function uploadProfileImage() {
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
      })
      .catch((uploadError) => {
        $uploadStatus.text = 'File upload error';
        console.error(`Error: ${uploadError.errorCode}`);
        console.error(uploadError.errorDescription);
      })
      .finally(() => {
        $uploadButton.buttonLabel = previousButtonLabel;
        enableSubmissionButton();
      });
  } else {
    $uploadStatus.text = 'Please choose a file to upload.';
  }
}

async function submitProfileInfoForm() {
  const $submissionStatus = $w('#submissionStatus' as 'Text');
  $submissionStatus.text = 'Submitting ...';
  $submissionStatus.show();

  try {
    await submitInitialTeachersForm(state.fieldValues);
    $submissionStatus.text = 'Profile updated, redirecting to dashboard...';
    await refreshInitialState();
    wixLocation.to('/dashboard');
  } catch (error) {
    $submissionStatus.text = `Update failed: ${error.message}`;
  }
}
