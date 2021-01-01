import { debounce } from 'lodash';
import { addWixLocationQueryParams } from './wix-utils';

export function setupInputChangeHandlers(textInputs: string[], dropdowns: string[]) {
  textInputs.forEach((field) => {
    $w(`#${field}` as 'TextInput').onInput(
      debounce((event) => {
        addWixLocationQueryParams({ [field]: event.target.value });
      }, 500)
    );
  });

  dropdowns.forEach((field) => {
    $w(`#${field}` as 'Dropdown').onChange((event) => {
      addWixLocationQueryParams({ [field]: event.target.value });
    });
  });
}
