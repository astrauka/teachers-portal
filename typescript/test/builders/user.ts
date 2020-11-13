import { RegistrationResult } from '../../backend/types/wix-types';
import { RegistrationResultStatus, User } from '../../common/types/wix-types';
import { builder } from './builder';

export const buildUser = builder<User>((id) => ({
  id: `${id}`,
  loggedIn: true,
  role: 'deprecated',
  getEmail: async () => `${id}-email`,
  getPricingPlans: async () => [],
  getRoles: async () => [],
}));

export const buildRegistrationResult = builder<RegistrationResult>((id) => ({
  status: RegistrationResultStatus.Active,
  sessionToken: `${id}-session-token`,
  approvalToken: `${id}-approval-token`,
  user: buildUser({ id }),
}));
