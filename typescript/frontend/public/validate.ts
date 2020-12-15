import { default as FastestValidator, ValidationError, ValidationSchema } from 'fastest-validator';
import { pick } from 'lodash';

const validator = new FastestValidator();

export function addFieldValidation(field: string, schema: ValidationSchema): void {
  // @ts-ignore Argument of type '"FormElement"' is not assignable to parameter of type...
  $w(`#${field}` as 'FormElement').onCustomValidation(
    // @ts-ignore A function whose declared type is neither 'void' nor 'any' must return a value.
    (value, reject): $w.Validator => {
      const $validationMessage = $w(`#${field}ValidationMessage` as 'Text');
      const result = validator.validate({ [field]: value }, pick(schema, field));
      if (result !== true) {
        const message = humanizeValidationMessage(result);
        reject(message);
        $validationMessage.text = message;
        $validationMessage.show();
      } else {
        $validationMessage.hide();
        $validationMessage.text = '';
      }
    }
  );
}

export function validateField(
  field: string,
  value: string | object[],
  schema: ValidationSchema,
  { updateValidationMessage = true }: { updateValidationMessage?: boolean } = {}
): string {
  const $validationMessage = $w(`#${field}ValidationMessage` as 'Text');
  const validationResult = validator.validate({ [field]: value }, pick(schema, field));
  const message = humanizeValidationMessage(validationResult);
  if (!updateValidationMessage) {
    return message;
  }
  if (message) {
    $validationMessage.text = message;
    $validationMessage.show();
  } else {
    $validationMessage.hide();
    $validationMessage.text = '';
  }
  return message;
}

function humanizeValidationMessage(validationResult: boolean | ValidationError[]) {
  return validationResult === true ? '' : validationResult[0].message;
}
