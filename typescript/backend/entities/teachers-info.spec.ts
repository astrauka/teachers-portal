import { buildTeachersInfo } from '../../test/builders/teachers-info';
import { expect, getErrorOf } from '../../test/utils/expectations';
import { validateTeachersInfo } from './teachers-info';

describe('validateTeachersInfo', () => {
  const teachersInfo = buildTeachersInfo();

  it('should return teachers info', () => {
    expect(validateTeachersInfo(teachersInfo)).to.eql(teachersInfo);
  });

  context('with all required fields present', () => {
    const teachersInfo = buildTeachersInfo();

    it('should return teachers info', () => {
      expect(validateTeachersInfo(teachersInfo)).to.eql(teachersInfo);
    });
  });

  context('on invalid input', () => {
    const teachersInfo = buildTeachersInfo({
      properties: { email: 'email' },
      without: ['firstName', 'lastName'],
    });

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateTeachersInfo(teachersInfo)).message;
      expect(errorMessage).to.include('field must be a valid e-mail');
      expect(errorMessage).to.include("The 'firstName' field is required");
      expect(errorMessage).to.include("The 'lastName' field is required");
    });
  });
});
