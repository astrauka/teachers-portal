import { expect } from '../../test/utils/expectations';

import { idFromString } from './forms';

describe('forms', () => {
  describe('idFromString', () => {
    const value = 'some-id';
    const convert = (value) => `${value}+/=`;

    it('should return base64 string representation without invalid characters', () => {
      expect(idFromString(value, convert)).to.eq('some0id000');
    });
  });
});
