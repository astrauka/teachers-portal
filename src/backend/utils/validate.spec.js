import { expect } from '../../test/utils/expectations';
import { buildValidator } from './validate';
describe('buildValidator', () => {
    const schema = {
        email: { type: 'email' },
        city: { type: 'string', min: 3, max: 255 },
    };
    const validate = buildValidator(schema);
    const input = { email: 'user@gmail.com', city: 'Some city' };
    it('should return input', () => {
        expect(validate(input)).to.eql(input);
    });
    context('on error', () => {
        const input = { email: 'some', city: 'c' };
        it('should nicely format the message', () => {
            expect(() => validate(input)).to.throw("The 'email' field must be a valid e-mail. The 'city' field length must be greater than or equal to 3 characters long.");
        });
    });
});
