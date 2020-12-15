import { ValidationSchema } from 'fastest-validator';
import { omit } from 'lodash';
import {
  InitialTeacherForm,
  SecondStepTeachersForm,
  TeachersProfile,
} from '../entities/teachers-profile';

export const initialTeachersFormSchema: ValidationSchema<InitialTeacherForm> = {
  profileImage: { type: 'string', min: 3 },
  phoneNumber: { type: 'string', min: 3, max: 255, pattern: /^\+?[\d\-\s]+$/ },
  city: { type: 'string', min: 3, max: 255 },
  streetAddress: { type: 'string', min: 3 },
  country: { type: 'string', empty: false },
  language: { type: 'string', empty: false },
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
  about: { type: 'string', optional: true },
  photos: {
    type: 'array',
    optional: true,
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

export const teachersProfileSchema: ValidationSchema<TeachersProfile> = {
  _id: { type: 'string', min: 3, max: 255, optional: true },
  email: { type: 'email' },
  fullName: { type: 'string', min: 3 },
  slug: { type: 'string', min: 3, optional: true },
  countryId: { type: 'string', min: 3, max: 255 },
  languageId: { type: 'string', min: 3, max: 255 },
  levelId: { type: 'string', min: 3, max: 255 },
  statusId: { type: 'string', min: 3, max: 255 },
  teachersInfoId: { type: 'string', min: 3, max: 255 },
  ...omit(initialTeachersFormSchema, ['country', 'language']),
  // ...secondStepTeachersFormSchema,
};
