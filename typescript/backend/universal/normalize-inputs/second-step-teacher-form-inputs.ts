import { last } from 'lodash';

import { SecondStepTeachersForm, SecondStepTeachersFormKey } from '../entities/teacher';

export function normalizeSecondStepTeacherFormInput<
  Value extends SecondStepTeachersForm[SecondStepTeachersFormKey]
>(field: SecondStepTeachersFormKey, value: Value) {
  switch (field) {
    case 'facebook':
      return getSocialLinkUsername(value as string, 'facebook.com/');
    case 'instagram':
      return getSocialLinkUsername(value as string, 'instagram.com/');
    case 'linkedIn':
      return getSocialLinkUsername(value as string, 'linkedin.com/in/');
    default:
      return value;
  }
}

function getSocialLinkUsername(linkOrUsername: string, separator: string): string | undefined {
  return linkOrUsername ? last(linkOrUsername.split(separator)) : undefined;
}
