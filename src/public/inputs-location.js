import { debounce } from 'lodash';
import { addWixLocationQueryParams } from './wix-utils';
export function setupInputChangeHandlers(textInputs, dropdowns) {
    textInputs.forEach((field) => {
        $w(`#${field}`).onInput(debounce((event) => {
            addWixLocationQueryParams({ [field]: event.target.value });
        }, 500));
    });
    dropdowns.forEach((field) => {
        $w(`#${field}`).onChange((event) => {
            addWixLocationQueryParams({ [field]: event.target.value });
        });
    });
}
