import { default as FastestValidator } from 'fastest-validator';
import { pick } from 'lodash';
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
export function validateField(field, value, schema) {
    const $validationMessage = $w(`#${field}ValidationMessage`);
    const validationResult = validator.validate({ [field]: value }, pick(schema, field));
    if (validationResult !== true) {
        const message = humanizeValidationMessage(validationResult);
        $validationMessage.text = message;
        $validationMessage.show();
        return message;
    }
    else {
        $validationMessage.hide();
        $validationMessage.text = '';
        return '';
    }
}
function humanizeValidationMessage(errors) {
    return errors.map((error) => error.message).join(' ');
}
