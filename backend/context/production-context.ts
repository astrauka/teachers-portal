import wixCRM from 'wix-crm-backend';
import wixData from 'wix-data';
import { getSecret } from 'wix-secrets-backend';
import wixUsers from 'wix-users-backend';

export const EXTERNALS = {
  wixCRM,
  wixData,
  wixUsers,
  getSecret,
};

export type Externals = typeof EXTERNALS;
