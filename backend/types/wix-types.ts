/// <reference types="corvid-types/types/backend" />
export import ContactInfo = wix_crm_backend.ContactInfo;
import HookContext = wix_data.Hooks.HookContext;
export import WixDataQuery = wix_data.WixDataQuery;
export import WixDataQueryReferencedResult = wix_data.WixDataQueryReferencedResult;
export import WixDataQueryResult = wix_data.WixDataQueryResult;

export import User = wix_users.User;
export import UserPicture = wix_users_backend.Picture;
export import RegistrationResult = wix_users_backend.RegistrationResult;

export type Member = Omit<wix_users_backend.UserInfo, 'id'> & { _id: string };

export enum RegistrationResultStatus {
  Pending = 'Pending',
  Active = 'Active',
}

export enum MemberStatus {
  Applicant = 'Applicant',
  Active = 'Active',
  Blocked = 'Blocked',
}

export type WixHookContext<T> = Omit<HookContext, 'currentItem'> & { currentItem: T };
