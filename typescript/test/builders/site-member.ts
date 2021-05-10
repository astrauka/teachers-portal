import { SiteMember, UserPicture } from '../../backend/types/wix-types';
import { MemberStatus } from '../../backend/universal/common-wix-types';
import { daysAgo, daysAgoAsDate } from '../utils/date';
import { builder } from './builder';

export const buildUserPicture = builder<UserPicture>((id) => ({
  url: `https://www.picture.com/${id}`,
}));

export const buildSiteMember = builder<SiteMember>((id) => ({
  _id: `${id}`,
  name: `${id}-full-name`,
  memberName: `${id}-member-name`,
  firstName: `${id}-first-name`,
  lastName: `${id}-last-name`,
  loginEmail: `${id}-email`,
  emails: [`${id}-email`],
  slug: `${id}-slug`,
  status: MemberStatus.Active,
  phones: ['123'],
  mainPhone: '123',
  language: 'us',
  picture: buildUserPicture({ id }),
  nickname: `${id}-nickname`,
  lastLogin: daysAgo(1),
  creationDate: daysAgoAsDate(3),
  lastUpdateDate: daysAgoAsDate(2),
  lastLoginDate: daysAgoAsDate(1),
  labels: [],
  customFields: `${id}-custom-fields`,
}));
