import { Storable } from './storable';

export interface TeachersProfile extends Storable {
  email: string;
  profileImage: string;
  fullName: string;
  slug: string;
  phoneNumber: string;
  countryId: string;
  city: string;
  streetAddress: string;
  languageId: string;
  levelId: string;
  statusId: string;
  teachersInfoId: string;
  facebook: string;
  instagram: string;
  linkedIn: string;
  about: string;
}

export interface TeachersProfileView extends TeachersProfile {
  country: string;
  language: string;
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

export interface SecondStepTeacherForm {
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  about?: string;
}
export type SecondStepTeacherFormKey = keyof SecondStepTeacherForm;
