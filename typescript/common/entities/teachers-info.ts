import { Storable } from './storable';

export interface TeachersInfo extends Storable {
  email: string;
  firstName: string;
  lastName: string;
  levelId: string;
  statusId: string;
  mentorId?: string;
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
