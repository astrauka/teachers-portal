import { GoogleUser } from '../../backend/types/google-user';
import { builder } from './builder';

export const buildGoogleUser = builder<GoogleUser>((id) => ({
  iss: `${id}-iss`,
  sub: `${id}-sub`,
  email: `${id}-email@gmail.com`,
  aud: `${id}-aud`,
  iat: 1,
  exp: 2,
}));
