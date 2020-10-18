import wixLocation from 'wix-location';

export function setupInputChangeHandlers(inputFields, $w) {
    for (const [input, field] of Object.entries(inputFields)) {
        if ($w(input).onInput) {
            $w(input).onInput(event => {
                wixLocation.queryParams.add({
                    [field]: event.target.value });
            });
        } else {
            $w(input).onChange(event => {
                wixLocation.queryParams.add({
                    [field]: event.target.value });
            });
        }
    }
}

export function updateInputValueIfChanged(inputFields, $w) {
    const values = wixLocation.query;
    for (const [input, field] of Object.entries(inputFields)) {
        const inputValue = $w(input).value;
        const fieldValue = values[field];
        if (inputValue !== fieldValue) {
            $w(input).value = fieldValue;
        }
    }
}

export function resetInputFieldValues(inputFields, $w) {
    const emptyFields = Object.entries(inputFields).reduce((acc, [input, field]) => {
        acc[field] = '';
        return acc;
    }, {})
    wixLocation.queryParams.add(emptyFields);
}