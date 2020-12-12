import { ValidationSchema } from 'fastest-validator';
import { TeachersInfo } from '../entities/teachers-info';

export const teachersInfoSchema: ValidationSchema<TeachersInfo> = {
  _id: { type: 'string', min: 3, max: 255, optional: true },
  email: { type: 'email' },
  firstName: { type: 'string', min: 3, max: 255 },
  lastName: { type: 'string', min: 3, max: 255 },
  levelId: { type: 'string', min: 3, max: 255 },
  statusId: { type: 'string', min: 3, max: 255 },
  mentorId: { type: 'string', min: 3, optional: true },
  certificateExpirationDate: { type: 'date', optional: true },
  userId: { type: 'string', min: 3, optional: true },
};
