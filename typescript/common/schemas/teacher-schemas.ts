import { ValidationSchema } from 'fastest-validator';
import { chain, omit } from 'lodash';
import { Storable } from '../entities/storable';
import {
  AdminFilledInformation,
  ComputedTeacherInformation,
  InitialTeacherForm,
  InitialTeacherFormFilledInformation,
  SecondStepTeachersForm,
  Tasks,
  Teacher,
} from '../entities/teacher';

export const adminFilledInformationSchema: ValidationSchema<
  AdminFilledInformation & Storable & { siteMemberId: string }
> = {
  _id: { type: 'string', min: 3, max: 255, optional: true },
  email: { type: 'email' },
  firstName: { type: 'string', min: 3, max: 255, trim: true },
  lastName: { type: 'string', min: 3, max: 255, trim: true },
  levelId: { type: 'string', min: 3, max: 255 },
  statusId: { type: 'string', min: 3, max: 255 },
  mentorId: { type: 'string', min: 3, optional: true },
  certificateExpirationDate: { type: 'date', optional: true },
  certificateNumber: { type: 'string', min: 3, optional: true },
  modules: { type: 'string', min: 3, optional: true },
  streetAddress: { type: 'string', min: 3, trim: true, optional: true },
  siteMemberId: { type: 'string', min: 3, optional: true },
};

export const initialTeachersFormSchema: ValidationSchema<InitialTeacherForm> = {
  profileImage: { type: 'string', empty: false },
  phoneNumber: { type: 'string', min: 3, max: 255, pattern: /^\+?[\d\-\s]+$/, trim: true },
  city: { type: 'string', min: 3, max: 255, trim: true },
  country: { type: 'string', empty: false },
  language: { type: 'string', empty: false },
};

export const initialFormFilledInformationSchema: ValidationSchema<InitialTeacherFormFilledInformation> = {
  ...(chain(initialTeachersFormSchema)
    .omit(['country', 'language'])
    .transform((acc, definition, key) => {
      acc[key] = { ...omit(definition, 'min'), empty: true };
    }, {})
    .value() as Omit<ValidationSchema<InitialTeacherForm>, 'country' | 'language'>),
  countryId: { type: 'string', min: 3, max: 255, optional: true },
  languageId: { type: 'string', min: 3, max: 255, optional: true },
};

export const secondStepTeachersFormSchema: ValidationSchema<SecondStepTeachersForm> = {
  facebook: {
    type: 'string',
    empty: true,
    max: 300,
    pattern: /^([\w\-]*\/)*[\w\-.]*$/,
  },
  instagram: {
    type: 'string',
    empty: true,
    max: 300,
    pattern: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
  },
  linkedIn: {
    type: 'string',
    empty: true,
    max: 300,
    pattern: /([^\/?&\s]*)(?:\/|&|\?)?.*$/,
  },
  website: {
    type: 'url',
    empty: true,
  },
  about: { type: 'string', empty: true },
  photos: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        type: { type: 'string' },
        slug: { type: 'string', optional: true },
        src: { type: 'string' },
        description: { type: 'string', optional: true },
        title: { type: 'string', optional: true },
        link: { type: 'string', optional: true },
        thumbnail: { type: 'string', optional: true },
      },
    },
  },
};

const computedTeacherInformationSchema: ValidationSchema<ComputedTeacherInformation> = {
  fullName: { type: 'string', min: 3 },
  slug: { type: 'string', min: 3, optional: true },
  siteMemberId: { type: 'string', min: 3, optional: true },
  completedTasks: {
    type: 'array',
    items: 'string',
    enum: Tasks,
    unique: true,
    optional: true,
  },
};

export const teacherSchema: ValidationSchema<Teacher> = {
  ...adminFilledInformationSchema,
  ...computedTeacherInformationSchema,
  ...initialFormFilledInformationSchema,
  ...secondStepTeachersFormSchema,
};
