import { buildTask } from '../../test/builders/task';
import { buildTeachersInfo } from '../../test/builders/teachers-info';
import { buildTeachersProfile } from '../../test/builders/teachers-profile';
import { expect, getErrorOf } from '../../test/utils/expectations';
import { validateTask, validateTeachersInfo, validateTeachersProfile } from './validators';

describe('validateTask', () => {
  const task = buildTask();

  it('should return task', () => {
    expect(validateTask(task)).to.eql(task);
  });

  context('on invalid input', () => {
    const task = buildTask({ properties: { number: 0, title: '' } });

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateTask(task)).message;
      expect(errorMessage).to.include("The 'number' field must be greater than or equal to 1");
      expect(errorMessage).to.include(
        "The 'title' field length must be greater than or equal to 1 characters long"
      );
    });
  });
});

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

describe('validateTeachersProfile', () => {
  const teachersProfile = buildTeachersProfile();

  it('should return teachers profile', () => {
    expect(validateTeachersProfile(teachersProfile)).to.eql(teachersProfile);
  });

  context('on invalid input', () => {
    const teachersProfile = buildTeachersProfile({
      properties: { email: 'email' },
      without: ['profileImage'],
    });

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateTeachersProfile(teachersProfile)).message;
      expect(errorMessage).to.include('field must be a valid e-mail');
      expect(errorMessage).to.include("The 'profileImage' field is required");
    });
  });
});
