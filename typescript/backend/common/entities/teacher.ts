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
  modules: string;
}

export interface InitialTeacherForm {
  profileImage: string;
  phoneNumber: string;
  countryId: string;
  city: string;
  languageId: string;
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

export const TEACHER_PUBLIC_FIELDS: (keyof Teacher)[] = [
  '_id',
  'email',
  'firstName',
  'lastName',
  'levelId',
  'statusId',
  'mentorId',
  'certificateExpirationDate',
  'certificateNumber',
  'countryId',
  'languageId',
  'city',
  'fullName',
  'slug',
  'completedTasks',
  'modules',
  'profileImage',
  'facebook',
  'instagram',
  'linkedIn',
  'website',
  'about',
  'photos',
];
export const TEACHER_ALL_FIELDS: (keyof Teacher)[] = [...TEACHER_PUBLIC_FIELDS, 'phoneNumber'];
export type TeacherView = Pick<Teacher, typeof TEACHER_PUBLIC_FIELDS[number]> & {
  phoneNumber?: string;
};

export const TEACHER_DEFAULTS = {
  slug: null,
  mentorId: null,
  certificateExpirationDate: null,
  profileImage: '',
  phoneNumber: '',
  countryId: null,
  city: '',
  modules: '',
  languageId: null,
  facebook: '',
  instagram: '',
  linkedIn: '',
  website: '',
  about: '',
  photos: [],
  completedTasks: [],
};

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
