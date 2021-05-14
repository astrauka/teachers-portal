import { ValidationError, ValidationSchema } from 'fastest-validator';

import { InvalidRequestError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Validator = require('fastest-validator');

const validator = new Validator();

export function buildValidator<T>(
  schema: ValidationSchema,
  { strict = true }: { strict?: boolean } = {}
) {
  const check: (input: T) => true | ValidationError[] = validator.compile({
    ...schema,
    $$strict: strict,
  });
  return (input: T) => {
    const result = check(input);
    if (result === true) {
      return input;
    }
    throw new InvalidRequestError(humanizeValidationMessage(result));
  };
}

function humanizeValidationMessage(errors: ValidationError[]) {
  return errors.map((error: ValidationError) => `'${error.actual}' ${error.message}`).join(' ');
}
