import { withLogger } from '../utils/logger';
export class SecretsService {
    constructor(externals) {
        this.externals = externals;
    }
    async getSecrets() {
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
