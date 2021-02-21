const Validator = require('fastest-validator'); // tslint:disable-line:no-var-requires
import { InvalidRequestError } from './errors';
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
    return errors.map((error) => error.message).join(' ');
}
