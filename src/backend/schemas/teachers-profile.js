import { pick } from 'lodash';
import { buildValidator } from '../utils/validate';
const teachersProfileSchema = {
    _id: { type: 'string', min: 3, max: 255, optional: true },
    email: { type: 'email' },
    fullName: { type: 'string', min: 3 },
    slug: { type: 'string', min: 3, optional: true },
    profileImage: { type: 'string', min: 3 },
    phoneNumber: { type: 'string', min: 3, max: 255 },
    countryId: { type: 'string', min: 3, max: 255 },
    city: { type: 'string', min: 3, max: 255 },
    streetAddress: { type: 'string', min: 3 },
    languageId: { type: 'string', min: 3, max: 255 },
    levelId: { type: 'string', min: 3, max: 255 },
    statusId: { type: 'string', min: 3, max: 255 },
    teachersInfoId: { type: 'string', min: 3, max: 255 },
};
const teachersProfileUpdateSchema = {
    ...pick(teachersProfileSchema, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
    country: { type: 'string' },
    language: { type: 'string' },
};
export let validateTeachersProfile;
validateTeachersProfile = buildValidator(teachersProfileSchema);
export const validateTeachersProfileUpdate = buildValidator(teachersProfileUpdateSchema);
