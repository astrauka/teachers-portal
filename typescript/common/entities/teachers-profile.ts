import { ImageItem, VideoItem } from '../manual-wix-types';
import { Storable } from './storable';

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
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  website?: string;
  about?: string;
  photos?: ImageItem[] | VideoItem[];
}
export type SecondStepTeacherFormKey = keyof SecondStepTeachersForm;

export interface TeachersProfile
  extends Storable,
    Omit<InitialTeacherForm, 'country' | 'language'>,
    SecondStepTeachersForm {
  email: string;
  fullName: string;
  slug: string;
  countryId: string;
  languageId: string;
  levelId: string;
  statusId: string;
  teachersInfoId: string;
}

export interface TeachersProfileView extends TeachersProfile {
  country: string;
  language: string;
}
