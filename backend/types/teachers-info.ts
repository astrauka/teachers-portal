import { buildValidator } from '../utils/validate';
import { Storable } from './storable';

export interface TeachersInfo extends Storable {
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  status?: string;
  mentor?: string;
  certificateExpirationDate?: Date;
  userId?: string;
}

export interface RegisteredTeachersInfo extends TeachersInfo {
  userId: string;
}

export enum TeacherLevel {
  NotATeacher = 'Not a teacher',
  UtaraAhikari = 'Utara Adhikari',
  Adhikari = 'Adhikari',
  Basic2 = 'Basic II',
  Basic = 'Basic',
}

export enum TeacherStatus {
  Active = 'Active',
  Suspended = 'Suspended',
}

const teachersInfoSchema = {
  _id: { type: 'string', min: 3, max: 255, optional: true },
  email: { type: 'email' },
  firstName: { type: 'string', min: 3, max: 255 },
  lastName: { type: 'string', min: 3, max: 255 },
  level: { type: 'string', min: 3, max: 255, optional: true },
  status: { type: 'string', min: 3, max: 255, optional: true },
  mentor: { type: 'string', min: 3, optional: true },
  certificateExpirationDate: { type: 'date', optional: true },
  userId: { type: 'string', min: 3, optional: true },
};

export const validateTeachersInfo = buildValidator<TeachersInfo>(teachersInfoSchema);
