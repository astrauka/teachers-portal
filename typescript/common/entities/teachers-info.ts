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

export interface TeacherLevel {
  _id: string;
  title: TeacherLevels;
  order: number;
}

export enum TeacherLevels {
  UtaraAhikari = 'Utara Adhikari',
  Adhikari = 'Adhikari',
  Basic2 = 'Basic II',
  Basic = 'Basic',
}

export interface AccountStatus {
  _id: string;
  title: AccountStatuses;
  order: number;
}

export enum AccountStatuses {
  Active = 'Active',
  Suspended = 'Suspended',
  NotATeacher = 'Not a teacher',
}
