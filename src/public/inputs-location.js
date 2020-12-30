import { addWixLocationQueryParams, getWixLocationQuery } from './wix-utils';
export function setupInputChangeHandlers(inputFields, $w) {
    for (const [input, field] of Object.entries(inputFields)) {
        if ($w(input).onInput) {
            $w(input).onInput((event) => {
                addWixLocationQueryParams({ [field]: event.target.value });
            });
        }
        else {
            $w(input).onChange((event) => {
                addWixLocationQueryParams({ [field]: event.target.value });
            });
        }
    }
}
export function updateInputValueIfChanged(inputFields) {
    const values = getWixLocationQuery();
    for (const [input, field] of Object.entries(inputFields)) {
        const inputValue = $w(input).value;
        const fieldValue = values[field];
        if (inputValue !== fieldValue) {
            $w(input).value = fieldValue;
        }
    }
}
export function resetInputFieldValues(inputFields) {
    const emptyFields = Object.entries(inputFields).reduce((acc, [input, field]) => {
        acc[field] = '';
        return acc;
    }, {});
    addWixLocationQueryParams(emptyFields);
}
