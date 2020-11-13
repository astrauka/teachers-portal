import { TeachersProfile, TeachersProfileView } from '../../common/entities/teachers-profile';
import { builder } from './builder';

export const buildTeachersProfile = builder<TeachersProfile>((id) => ({
  _id: `${id}`,
  email: `${id}-email@gmail.com`,
  profileImage: `${id}-profile-image`,
  fullName: `${id} Full Name`,
  slug: `${id}-full-name`,
  phoneNumber: `${id}-phone-number`,
  countryId: `${id}-country-id`,
  city: `${id}-city-id`,
  streetAddress: `${id}-street-address`,
  languageId: `${id}-language-id`,
  userId: `${id}-user-id`,
  levelId: `${id}-level-id`,
  statusId: `${id}-status-id`,
  teachersInfoId: `${id}-teachersInfo-id`,
}));

export const buildTeachersProfileView = builder<TeachersProfileView>((id) => ({
  ...buildTeachersProfile({ id }),
  country: `${id}-country-title`,
  language: `${id}-language-title`,
}));
