import {
  RegisteredTeachersInfo,
  TeacherLevel,
  TeachersInfo,
  TeacherStatus,
} from '../../backend/types/teachers-info';
import { inDaysAsDate } from '../utils/date';
import { builder } from './builder';

export const buildTeachersInfo = builder<TeachersInfo>((id) => ({
  _id: `${id}`,
  email: `${id}-email@gmail.com`,
  firstName: `${id}-first-name`,
  lastName: `${id}-last-name`,
  level: TeacherLevel.Basic,
  status: TeacherStatus.Active,
  mentor: `${id}-mentor-id`,
  certificateExpirationDate: inDaysAsDate(100),
}));

export const buildRegisteredTeachersInfo = builder<RegisteredTeachersInfo>((id) => ({
  ...buildTeachersInfo({ id }),
  userId: `${id}-user-id`,
}));
