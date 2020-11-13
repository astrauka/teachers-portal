import { $W } from '../wix-types';
import { addWixLocationQueryParams, getWixLocationQuery } from './wix-utils';

export type InputNamesToDbFields = { [inputName: string]: string };

export function setupInputChangeHandlers(inputFields: InputNamesToDbFields, $w: $W) {
  for (const [input, field] of Object.entries(inputFields)) {
    if ($w(input as 'TextInput').onInput) {
      $w(input as 'TextInput').onInput((event) => {
        addWixLocationQueryParams({ [field]: event.target.value });
      });
    } else {
      $w(input as 'Dropdown').onChange((event) => {
        addWixLocationQueryParams({ [field]: event.target.value });
      });
    }
  }
}

export function updateInputValueIfChanged(inputFields: InputNamesToDbFields, $w: $W) {
  const values = getWixLocationQuery();
  for (const [input, field] of Object.entries(inputFields)) {
    const inputValue = $w(input as 'TextInput').value;
    const fieldValue = values[field];
    if (inputValue !== fieldValue) {
      $w(input as 'TextInput').value = fieldValue;
    }
  }
}

export function resetInputFieldValues(inputFields: InputNamesToDbFields) {
  const emptyFields = Object.entries(inputFields).reduce((acc, [input, field]) => {
    acc[field] = '';
    return acc;
  }, {});
  addWixLocationQueryParams(emptyFields);
}
