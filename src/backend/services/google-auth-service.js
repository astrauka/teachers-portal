import { UnauthenticatedError } from '../utils/errors';
import { withLogger } from '../utils/logger';
export class GoogleAuthService {
    constructor(oauthClient, GOOGLE_CLIENT_ID) {
        this.oauthClient = oauthClient;
        this.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
    }
    verifyGoogleToken(idToken) {
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
