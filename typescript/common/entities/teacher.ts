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
}

export interface InitialTeacherFormFilledInformation {
  profileImage: string;
  phoneNumber: string;
  countryId: string;
  languageId: string;
  city: string;
  streetAddress: string;
}

export interface ComputedTeacherInformation {
  fullName: string;
  siteMemberId: string | null;
  slug: string;
}

export interface InitialTeacherForm {
  profileImage: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
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
