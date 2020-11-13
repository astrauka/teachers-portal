import { RegisteredTeachersInfo, TeachersInfo } from '../../common/types/teachers-info';
import { inDaysAsDate } from '../utils/date';
import { builder } from './builder';

export const buildTeachersInfo = builder<TeachersInfo>((id) => ({
  _id: `${id}`,
  email: `${id}-email@gmail.com`,
  firstName: `${id}-first-name`,
  lastName: `${id}-last-name`,
  levelId: `${id}-level-id`,
  statusId: `${id}-status-id`,
  mentorId: `${id}-mentor-id`,
  certificateExpirationDate: inDaysAsDate(100),
}));

export const buildRegisteredTeachersInfo = builder<RegisteredTeachersInfo>((id) => ({
  ...buildTeachersInfo({ id }),
  userId: `${id}-user-id`,
}));
