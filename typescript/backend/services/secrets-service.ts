import { Externals } from '../context/production-context';

export class SecretsService {
  constructor(private readonly externals: Externals) {}

  public async getSecrets() {
    const [passwordSalt, passwordSecret] = await Promise.all([
      this.externals.getSecret('PASSWORD_SALT'),
      this.externals.getSecret('PASSWORD_SECRET'),
    ]);
    return {
      passwordSalt,
      passwordSecret,
    };
  }
}
