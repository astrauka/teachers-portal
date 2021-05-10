/// <reference types="corvid-types/types/backend" />
import { MemberStatus } from '../universal/common-wix-types';

export import ContactInfo = wix_crm_backend.ContactInfo;
export import UserPicture = wix_users_backend.Picture;
export import RegistrationResult = wix_users_backend.RegistrationResult;

import HookContext = wix_data.Hooks.HookContext;
export type WixHookContext<T> = Omit<HookContext, 'currentItem'> & { currentItem: T };

export import WixDataQueryResult = wix_data.WixDataQueryResult;
export import WixDataQueryReferencedResult = wix_data.WixDataQueryReferencedResult;

export type SiteMember = Omit<wix_users_backend.UserInfo, 'id'> & {
  _id: string;
  status: MemberStatus;
};
