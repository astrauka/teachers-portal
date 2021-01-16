import { submitSecondStepTeachersForm } from 'backend/backend-api';
import { pick, some, transform, values } from 'lodash';
import { MediaItemTypes } from 'public/common/common-wix-types';
import { secondStepTeachersFormSchema } from 'public/common/schemas/teacher-schemas';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { idFromString } from 'public/forms';
import { refreshInitialState } from 'public/global-state';
import { validateField } from 'public/validate';
import wixLocation from 'wix-location';
const TEXT_INPUTS = ['facebook', 'instagram', 'linkedIn', 'website'];
const RICH_TEXT_INPUTS = ['about'];
const FORM_FIELDS = [...TEXT_INPUTS, ...RICH_TEXT_INPUTS, 'photos'];
const FIELDS_WITH_VALIDATION = [
    'facebook',
    'instagram',
    'linkedIn',
    'website',
];
let state;
forCurrentTeacher(async ({ teacher }) => {
    const fieldValues = pick(teacher, FORM_FIELDS);
    state = {
        teacher,
        fieldValues,
        validationMessages: transform(fieldValues, (acc, value, field) => {
            acc[field] = validateField(field, value, secondStepTeachersFormSchema, {
                updateValidationMessage: TEXT_INPUTS.includes(field),
            });
        }),
    };
    await assignCurrentTeacherProfileFormFields();
    deletePhotoOnClick();
    $w('#uploadPhotos').onChange(() => uploadPhotos());
    $w('#submitButton').onClick(() => submitForm());
});
async function assignCurrentTeacherProfileFormFields() {
    setPhotosRepeaterData();
    RICH_TEXT_INPUTS.forEach((field) => {
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onChange((event) => {
            return onInputChange(field, event);
        });
    });
    TEXT_INPUTS.forEach((field) => {
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onInput((event) => {
            return onInputChange(field, event);
        });
    });
}
function onInputChange(field, event) {
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
function deletePhotoOnClick() {
    const $photos = $w('#photos');
    $photos.onItemReady(($item, data) => {
        $item('#photosImage').src = data.image;
        const $deleteBox = $item('#photoDeleteBox');
        $deleteBox.onClick(() => {
            state.fieldValues.photos = state.fieldValues.photos.filter((photo) => photo.src !== data.image);
            setPhotosRepeaterData();
        });
    });
}
function setPhotosRepeaterData() {
    const data = state.fieldValues.photos.map((photo) => ({
        _id: idFromString(photo.src, btoa),
        image: photo.src,
    }));
    const $photos = $w('#photos');
    const $noPhotosText = $w('#noPhotosText');
    $photos.data = data;
    if (data.length) {
        $noPhotosText.collapse();
        $photos.expand();
    }
    else {
        $photos.collapse();
        $noPhotosText.expand();
    }
}
function uploadPhotos() {
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
            setPhotosRepeaterData();
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
async function submitForm() {
    const $submissionStatus = $w('#submissionStatus');
    $submissionStatus.text = 'Submitting ...';
    $submissionStatus.show();
    try {
        await submitSecondStepTeachersForm(state.fieldValues);
        $submissionStatus.text = 'Profile updated, redirecting to your profile...';
        await refreshInitialState();
        wixLocation.to(`/teacher/${state.teacher.slug}`);
    }
    catch (error) {
        $submissionStatus.text = `Update failed: ${error.message}`;
    }
}
