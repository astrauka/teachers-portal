import { keys, pick } from 'lodash';

import { buildInitialTeacherForm, buildTeacher } from '../../test/builders/teacher';
import { buildTeacherModule } from '../../test/builders/teacher-module';
import { expect, getErrorOf } from '../../test/utils/expectations';
import { InitialTeacherForm, SecondStepTeachersForm } from '../universal/entities/teacher';
import {
  initialTeachersFormSchema,
  secondStepTeachersFormSchema,
} from '../universal/schemas/teacher-schemas';

import {
  validateInitialTeachersForm,
  validateSecondStepTeachersForm,
  validateTeacher,
  validateTeacherModule,
} from './validate';

describe('validateTeacher', () => {
  const teacher = buildTeacher();

  it('should return teacher', () => {
    expect(validateTeacher(teacher)).to.eql(teacher);
  });

  context('on invalid input', () => {
    const teacher = buildTeacher({
      properties: { email: 'email' },
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
  const update = buildInitialTeacherForm();

  it('should return the update', () => {
    expect(validateInitialTeachersForm(update)).to.eql(update);
  });

  context('on invalid input', () => {
    const update = {
      ...(pick(buildTeacher(), keys(initialTeachersFormSchema)) as InitialTeacherForm),
      city: 'a',
    };

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateInitialTeachersForm(update)).message;
      expect(errorMessage).to.include('field length must be greater than or equal');
    });
  });
});

describe('validateSecondStepTeachersForm', () => {
  const update = pick(buildTeacher(), keys(secondStepTeachersFormSchema)) as SecondStepTeachersForm;

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
      ...pick(buildTeacher(), keys(secondStepTeachersFormSchema)),
      facebook: '~!@#@#  ///',
    } as SecondStepTeachersForm;

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateSecondStepTeachersForm(update)).message;
      expect(errorMessage).to.include('field fails to match the required pattern');
    });
  });
});

describe('validateTeacherModule', () => {
  const teacherModule = buildTeacherModule({ without: ['module'] });

  it('should return teacher module', () => {
    expect(validateTeacherModule(teacherModule)).to.eql(teacherModule);
  });

  context('on invalid teacher module', () => {
    const teacherModule = buildTeacherModule({ without: ['teacherId'] });

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateTeacherModule(teacherModule)).message;
      expect(errorMessage).to.include('field is required');
    });
  });
});
