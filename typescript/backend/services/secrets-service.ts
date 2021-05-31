import { Externals } from '../context/production-context';
import { withLogger } from '../utils/logger';

export class SecretsService {
  constructor(private readonly externals: Externals) {}

  public async getTestTeacherPassword(): Promise<string> {
    return withLogger(
      `getTestTeacherPassword`,
      this.externals.wixSecretsBackend.getSecret('TEST_API_PASSWORD')
    );
  }
}
