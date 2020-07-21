import { TeacherLevel, TeachersInfo, TeacherStatus } from '../../backend/types/teachers-info';
import { builder } from './builder';
import { inDaysAsDate } from '../utils/date';

export const buildTeachersInfo = builder<TeachersInfo>((id) => ({
  _id: `${id}`,
  email: `${id}-email@gmail.com`,
  firstName: `${id}-first-name`,
  lastName: `${id}-last-name`,
  level: TeacherLevel.Basic,
  status: TeacherStatus.Active,
  mentor: `${id}-mentor-id`,
  certificateExpirationDate: inDaysAsDate(100),
  userId: `${id}-user-id`,
}));
