import { Externals } from '../context/production-context';
import { withLogger } from '../utils/logger';

export class SecretsService {
  constructor(private readonly externals: Externals) {}

  public async getSecrets() {
    return withLogger('getSecrets', async () => {
      const [passwordSalt, passwordSecret] = await Promise.all([
        this.externals.getSecret('PASSWORD_SALT'),
        this.externals.getSecret('PASSWORD_SECRET'),
      ]);
      return {
        passwordSalt,
        passwordSecret,
      };
    });
  }
}
