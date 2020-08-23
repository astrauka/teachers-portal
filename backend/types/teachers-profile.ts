import { pick } from 'lodash';
import { buildValidator } from '../utils/validate';
import { Storable } from './storable';

export interface TeachersProfile extends Storable {
  email: string;
  profileImage: string;
  fullName: string;
  slug: string;
  phoneNumber: string;
  countryId: string;
  city: string;
  streetAddress: string;
  languageId: string;
  userId: string;
}

export interface TeachersProfileView extends TeachersProfile {
  country: string;
  language: string;
}

export interface TeachersProfileUpdate {
  profileImage: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  language: string;
}

const teachersProfileSchema = {
  _id: { type: 'string', min: 3, max: 255, optional: true },
  email: { type: 'email' },
  fullName: { type: 'string', min: 3 },
  slug: { type: 'string', min: 3 },
  profileImage: { type: 'string', min: 3 },
  phoneNumber: { type: 'string', min: 3, max: 255 },
  countryId: { type: 'string', min: 3, max: 255 },
  city: { type: 'string', min: 3, max: 255 },
  streetAddress: { type: 'string', min: 3 },
  languageId: { type: 'string', min: 3, max: 255 },
  userId: { type: 'string', min: 3, max: 255 },
};

const teachersProfileUpdateSchema = {
  ...pick(teachersProfileSchema, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
  country: { type: 'string' },
  language: { type: 'string' },
};

export const validateTeachersProfile = buildValidator<TeachersProfile>(teachersProfileSchema);
export const validateTeachersProfileUpdate = buildValidator<Partial<TeachersProfile>>(
  teachersProfileUpdateSchema
);
