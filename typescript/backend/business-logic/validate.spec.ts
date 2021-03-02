import { keys, pick } from 'lodash';
import { InitialTeacherForm, SecondStepTeachersForm } from '../../common/entities/teacher';
import {
  initialTeachersFormSchema,
  secondStepTeachersFormSchema,
} from '../../common/schemas/teacher-schemas';
import { buildTeacher, buildTeacherView } from '../../test/builders/teacher';
import { expect, getErrorOf } from '../../test/utils/expectations';
import {
  validateInitialTeachersForm,
  validateSecondStepTeachersForm,
  validateTeacher,
} from './validate';

describe('validateTeacher', () => {
  const teacher = buildTeacher();

  it('should return teacher', () => {
    expect(validateTeacher(teacher)).to.eql(teacher);
  });

  context('on invalid input', () => {
    const teacher = buildTeacher({
      properties: { email: 'email', streetAddress: '' },
      without: ['profileImage'],
    });

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateTeacher(teacher)).message;
      expect(errorMessage).to.include('field must be a valid e-mail');
      expect(errorMessage).to.include("The 'profileImage' field is required");
    });
  });
});

describe('validateInitialTeachersForm', () => {
  const update = pick(buildTeacherView(), keys(initialTeachersFormSchema)) as InitialTeacherForm;

  it('should return the update', () => {
    expect(validateInitialTeachersForm(update)).to.eql(update);
  });

  context('on invalid input', () => {
    const update = {
      ...(pick(buildTeacherView(), keys(initialTeachersFormSchema)) as InitialTeacherForm),
      city: 'a',
    };

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateInitialTeachersForm(update)).message;
      expect(errorMessage).to.include('field length must be greater than or equal');
    });
  });
});

describe('validateSecondStepTeachersForm', () => {
  const update = pick(
    buildTeacherView(),
    keys(secondStepTeachersFormSchema)
  ) as SecondStepTeachersForm;

  it('should return the update', () => {
    expect(validateSecondStepTeachersForm(update)).to.eql(update);
  });

  context('on blank values provided', () => {
    const update: SecondStepTeachersForm = {
      facebook: '',
      instagram: '',
      linkedIn: '',
      about: '',
      website: '',
      photos: [],
    };

    it('should return the update', () => {
      expect(validateSecondStepTeachersForm(update)).to.eql(update);
    });
  });

  context('on invalid input', () => {
    const update = {
      ...pick(buildTeacherView(), keys(secondStepTeachersFormSchema)),
      facebook: '~!@#@#  ///',
    } as SecondStepTeachersForm;

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateSecondStepTeachersForm(update)).message;
      expect(errorMessage).to.include('field fails to match the required pattern');
    });
  });
});
