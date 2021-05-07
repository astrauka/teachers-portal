import { default as FastestValidator } from 'fastest-validator';
import { pick } from 'lodash';
import { getElementWhenExists } from './wix-utils';
const validator = new FastestValidator();
export function addFieldValidation(field, schema) {
    // @ts-ignore Argument of type '"FormElement"' is not assignable to parameter of type...
    $w(`#${field}`).onCustomValidation(
    // @ts-ignore A function whose declared type is neither 'void' nor 'any' must return a value.
    (value, reject) => {
        const $validationMessage = $w(`#${field}ValidationMessage`);
        const result = validator.validate({ [field]: value }, pick(schema, field));
        if (result !== true) {
            const message = humanizeValidationMessage(result);
            reject(message);
            $validationMessage.text = message;
            $validationMessage.show();
        }
        else {
            $validationMessage.hide();
            $validationMessage.text = '';
        }
    });
}
export function validateField(field, value, schema, { updateValidationMessage = true } = {}) {
    const validationResult = validator.validate({ [field]: value }, pick(schema, field));
    const message = humanizeValidationMessage(validationResult);
    if (!updateValidationMessage) {
        return message;
    }
    const $validationMessage = getElementWhenExists($w(`#${field}ValidationMessage`));
    if ($validationMessage) {
        if (message) {
            $validationMessage.text = message;
            $validationMessage.show();
        }
        else {
            $validationMessage.hide();
            $validationMessage.text = '';
        }
        return message;
    }
    console.error(`Missing validation for ${field}`);
}
function humanizeValidationMessage(validationResult) {
    return validationResult === true ? '' : validationResult[0].message;
}
