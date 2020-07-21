import { pick } from 'lodash';
import { buildValidator } from '../utils/validate';
const teachersProfileSchema = {
    _id: { type: 'string', min: 3, max: 255, optional: true },
    email: { type: 'email' },
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
export const validateTeachersProfile = buildValidator(teachersProfileSchema);
export const validateTeachersProfileUpdate = buildValidator(teachersProfileUpdateSchema);
