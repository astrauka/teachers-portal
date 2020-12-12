import { expect } from '../../test/utils/expectations';
import { objectFromArray } from './forms';

describe('forms', () => {
  describe('objectFromArray', () => {
    const keys = ['a', 'b'];
    const value = 'a';

    it('should return object from array keys', () => {
      expect(objectFromArray(keys, value)).to.eql({ a: value, b: value });
    });
  });
});
