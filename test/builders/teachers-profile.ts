import { TeachersProfile } from '../../backend/types/teachers-profile';
import { builder } from './builder';

export const buildTeachersProfile = builder<TeachersProfile>((id) => ({
  _id: `${id}`,
  email: `${id}-email@gmail.com`,
  profileImage: `${id}-profile-image`,
  phoneNumber: `${id}-phone-number`,
  countryId: `${id}-country-id`,
  city: `${id}-city-id`,
  streetAddress: `${id}-street-address`,
  languageId: `${id}-language-id`,
  userId: `${id}-user-id`,
}));
