import { expect } from '../../test/utils/expectations';

import { buildValidator } from './validation';

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
      expect(() => validate(input)).to.throw(
        "'some' The 'email' field must be a valid e-mail. '1' The 'city' field length must be greater than or equal to 3 characters long."
      );
    });
  });

  context('on additional field', () => {
    const input = { email: 'user@gmail.com', city: 'Some city', additional: 'field' };

    it('should throw', () => {
      expect(() => validate(input)).to.throw("contains forbidden keys: 'additional'");
    });
  });
});
