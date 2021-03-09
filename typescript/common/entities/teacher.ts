import { ImageItem } from '../common-wix-types';
import { Storable } from './storable';

export interface AdminFilledInformation {
  email: string;
  firstName: string;
  lastName: string;
  levelId: string;
  statusId: string;
  mentorId: string | null;
  certificateExpirationDate: Date | null;
  certificateNumber: string;
}

export interface InitialTeacherFormFilledInformation {
  profileImage: string;
  phoneNumber: string;
  countryId: string;
  languageId: string;
  city: string;
}

export interface ComputedTeacherInformation {
  fullName: string;
  slug: string;
  completedTasks: TaskName[];
}

export interface InitialTeacherForm {
  profileImage: string;
  phoneNumber: string;
  country: string;
  city: string;
  language: string;
}
export type InitialTeacherFormKey = keyof InitialTeacherForm;

export interface SecondStepTeachersForm {
  facebook: string;
  instagram: string;
  linkedIn: string;
  website: string;
  about: string;
  photos: ImageItem[];
}
export type SecondStepTeachersFormKey = keyof SecondStepTeachersForm;

export interface Teacher
  extends Storable,
    AdminFilledInformation,
    InitialTeacherFormFilledInformation,
    SecondStepTeachersForm,
    ComputedTeacherInformation {}

export interface TeacherView extends Teacher {
  country: string;
  language: string;
}

export interface TeacherWix extends Omit<Teacher, 'statusId'> {
  statusId: AccountStatus;
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
  Inactive = 'Inactive',
  NotATeacher = 'Not a teacher',
}

export enum AccountStatusIds {
  Active = '01dbd966-7e18-43ea-8326-a1a6d15673a6',
  Inactive = 'ef855569-356d-47da-8f91-09df8c9570af',
  NotATeacher = 'f43d07b7-28da-4097-9541-a18d4ec1fc76',
}

export enum TaskName {
  initialProfileForm = 'initialProfileForm',
  secondStepProfileForm = 'secondStepProfileForm',
}

export const Tasks = [TaskName.initialProfileForm, TaskName.secondStepProfileForm];

export enum TaskStatus {
  completed = 'completed',
  current = 'current',
  upcoming = 'upcoming',
}
