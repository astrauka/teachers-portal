import { AdminFilledInformation, Teacher, TeacherView } from '../../common/entities/teacher';
import { inDaysAsDate } from '../utils/date';
import { builder } from './builder';

export const buildTeacher = builder<Teacher>((id) => ({
  _id: `${id}`,
  ...buildAdminFilledTeacher({ id }),
  fullName: `${id} Full Name`,
  slug: `${id}-full-name`,
  siteMemberId: `${id}-siteMemberId`,
  profileImage: `${id}-profile-image`,
  phoneNumber: '+370-625 5000',
  countryId: `${id}-country-id`,
  languageId: `${id}-language-id`,
  city: `${id}-city-id`,
  streetAddress: `${id}-street-address`,
  facebook: `${id}-facebook`,
  instagram: `${id}instagram`,
  linkedIn: `${id}-linked-in`,
  website: `https://www.${id}-site.com`,
  about: `${id}-about`,
  photos: [],
}));

export const buildAdminFilledTeacher = builder<AdminFilledInformation>((id) => ({
  email: `${id}-email@gmail.com`,
  firstName: `${id}-first-name`,
  lastName: `${id}-last-name`,
  levelId: `${id}-level-id`,
  statusId: `${id}-status-id`,
  mentorId: `${id}-mentor-id`,
  certificateExpirationDate: inDaysAsDate(100),
}));

export const buildTeacherView = builder<TeacherView>((id) => ({
  ...buildTeacher({ id }),
  country: `${id}-country-title`,
  language: `${id}-language-title`,
  photos: [],
}));
