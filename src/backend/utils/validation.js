import { InvalidRequestError } from './errors';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Validator = require('fastest-validator');
const validator = new Validator();
export function buildValidator(schema, { strict = true } = {}) {
    const check = validator.compile({
        ...schema,
        $$strict: strict,
    });
    return (input) => {
        const result = check(input);
        if (result === true) {
            return input;
        }
        throw new InvalidRequestError(humanizeValidationMessage(result));
    };
}
function humanizeValidationMessage(errors) {
    return errors.map((error) => `'${error.actual}' ${error.message}`).join(' ');
}
