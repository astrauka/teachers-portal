import { TeachersProfile, TeachersProfileView } from '../../common/entities/teachers-profile';
import { builder } from './builder';

export const buildTeachersProfile = builder<TeachersProfile>((id) => ({
  _id: `${id}`,
  email: `${id}-email@gmail.com`,
  profileImage: `${id}-profile-image`,
  fullName: `${id} Full Name`,
  slug: `${id}-full-name`,
  phoneNumber: '+370-625 5000',
  countryId: `${id}-country-id`,
  city: `${id}-city-id`,
  streetAddress: `${id}-street-address`,
  languageId: `${id}-language-id`,
  levelId: `${id}-level-id`,
  statusId: `${id}-status-id`,
  teachersInfoId: `${id}-teachersInfo-id`,
  facebook: `${id}-facebook`,
  instagram: `${id}instagram`,
  linkedIn: `${id}-linked-in`,
  website: `https://www.${id}-site.com`,
  about: `${id}-about`,
  photos: [],
}));

export const buildTeachersProfileView = builder<TeachersProfileView>((id) => ({
  ...buildTeachersProfile({ id }),
  country: `${id}-country-title`,
  language: `${id}-language-title`,
  photos: [],
}));
