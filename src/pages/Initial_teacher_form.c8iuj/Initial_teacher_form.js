import { submitInitialTeachersForm } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { refreshInitialState } from 'public/global-state';
import { initialTeachersFormSchema } from 'public/universal/schemas/teacher-schemas';
import { validateField } from 'public/validate';
import { loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';
const TEXT_INPUTS = ['phoneNumber', 'city'];
const DROPDOWNS = ['countryId', 'languageId'];
const FORM_INPUTS = [...TEXT_INPUTS, ...DROPDOWNS];
const FORM_FIELDS = [...FORM_INPUTS, 'profileImage'];
let state;
forCurrentTeacher('initialTeacherForm', async ({ teacher }) => {
    $w('#teacherFullName').text = teacher.fullName;
    const fieldValues = pick(teacher, FORM_FIELDS);
    state = {
        teacher,
        fieldValues,
        validationMessages: transform(fieldValues, (acc, value, field) => {
            acc[field] = validateField(field, value, initialTeachersFormSchema, {
                updateValidationMessage: FORM_INPUTS.includes(field),
            });
        }),
    };
    assignCurrentTeacherFormFields();
    $w('#uploadButton').onChange(() => uploadProfileImage());
    $w('#submit').onClick(() => submitProfileInfoForm());
    await updateDropdownValues();
});
function assignCurrentTeacherFormFields() {
    enableSubmissionButton();
    if (state.fieldValues.profileImage) {
        $w('#profileImage').src = state.fieldValues.profileImage;
    }
    TEXT_INPUTS.forEach((field) => {
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onInput((event) => onInputChange(field, event));
    });
    DROPDOWNS.forEach((field) => {
        const $dropdown = $w(`#${field}`);
        $dropdown.value = state.fieldValues[field];
        $dropdown.onChange((event) => onInputChange(field, event));
    });
}
function enableSubmissionButton() {
    const $submitButton = $w('#submit');
    const $submissionStatus = $w('#submissionStatus');
    if (some(values(state.validationMessages))) {
        $submissionStatus.text = 'Please fill in all the fields';
        $submissionStatus.show();
        $submitButton.disable();
    }
    else {
        $submissionStatus.text = '';
        $submissionStatus.hide();
        $submitButton.enable();
    }
}
async function onInputChange(field, event) {
    const value = event.target.value;
    state.fieldValues[field] = value;
    state.validationMessages[field] = validateField(field, value, initialTeachersFormSchema);
    enableSubmissionButton();
}
function uploadProfileImage() {
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
    }
    else {
        $uploadStatus.text = 'Please choose a file to upload.';
    }
}
async function submitProfileInfoForm() {
    const $submissionStatus = $w('#submissionStatus');
    $submissionStatus.text = 'Submitting ...';
    $submissionStatus.show();
    try {
        await submitInitialTeachersForm(state.fieldValues);
        $submissionStatus.text = 'Profile updated, redirecting to dashboard...';
        await refreshInitialState();
        wixLocation.to('/dashboard');
    }
    catch (error) {
        $submissionStatus.text = `Update failed: ${error.message}`;
    }
}
async function updateDropdownValues() {
    $w('#countryId').options = (await loadFirstDatasetPage($w('#CountriesDataset'))).map((country) => ({
        value: country._id,
        label: country.title,
    }));
    $w('#languageId').options = (await loadFirstDatasetPage($w('#LanguagesDataset'))).map((language) => ({
        value: language._id,
        label: language.title,
    }));
}
