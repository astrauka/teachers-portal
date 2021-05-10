import { pick } from 'lodash';
import {
  AdminFilledInformation,
  InitialTeacherForm,
  TaskName,
  Teacher,
  TeacherView,
  TEACHER_PUBLIC_FIELDS,
} from '../../backend/universal/entities/teacher';
import { inDaysAsDate } from '../utils/date';
import { builder } from './builder';

export const buildTeacher = builder<Teacher>((id) => ({
  _id: `${id}`,
  ...buildAdminFilledTeacher({ id }),
  fullName: `${id} Full Name`,
  slug: `${id}-full-name`,
  profileImage: `${id}-profile-image`,
  phoneNumber: '+370-625 5000',
  countryId: `${id}-country-id`,
  languageId: `${id}-language-id`,
  city: `${id}-city-id`,
  facebook: `${id}-facebook`,
  instagram: `${id}instagram`,
  linkedIn: `${id}-linked-in`,
  website: `https://www.${id}-site.com`,
  about: `${id}-about`,
  photos: [],
  completedTasks: [TaskName.initialProfileForm],
  modules: `${id}-modules`,
}));

export const buildAdminFilledTeacher = builder<AdminFilledInformation>((id) => ({
  email: `${id}-email@gmail.com`,
  firstName: `${id}-first-name`,
  lastName: `${id}-last-name`,
  levelId: `${id}-level-id`,
  statusId: `${id}-status-id`,
  mentorId: `${id}-mentor-id`,
  certificateExpirationDate: inDaysAsDate(100),
  certificateNumber: `${id}-certificate-number`,
}));

export const buildInitialTeacherForm = builder<InitialTeacherForm>((id) => ({
  profileImage: `${id}-profileImage`,
  phoneNumber: '+370-625 5000',
  countryId: `${id}-country`,
  city: `${id}-city`,
  languageId: `${id}-language`,
}));

export const buildTeacherView = builder<TeacherView>((id) =>
  pick(buildTeacher({ id }), TEACHER_PUBLIC_FIELDS)
);
