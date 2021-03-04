import wixCRM from 'wix-crm-backend';
import wixData from 'wix-data';
import wixSecretsBackend from 'wix-secrets-backend';
import wixUsers from 'wix-users-backend';

export const EXTERNALS = {
  wixCRM,
  wixData,
  wixUsers,
  wixSecretsBackend,
};

export type Externals = typeof EXTERNALS;
