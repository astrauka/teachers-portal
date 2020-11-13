import { OAuth2Client } from 'google-auth-library';
import { GoogleUser } from '../types/google-user';
import { UnauthenticatedError } from '../utils/errors';
import { withLogger } from '../utils/logger';

export class GoogleAuthService {
  constructor(
    private readonly oauthClient: OAuth2Client,
    private readonly GOOGLE_CLIENT_ID: string
  ) {}

  public verifyGoogleToken(idToken: string): Promise<GoogleUser> {
    return withLogger(`verifyGoogleToken ${idToken}`, async () => {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.GOOGLE_CLIENT_ID,
      });
      const user = ticket.getPayload();
      if (!user.email_verified) {
        throw new UnauthenticatedError(`Email is not verified of ${user.email}`);
      }
      return user;
    });
  }
}
