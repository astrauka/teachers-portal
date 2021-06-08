import { withLogger } from '../utils/logger';
export class SecretsService {
    constructor(externals) {
        this.externals = externals;
    }
    async getTestTeacherPassword() {
        return withLogger(`getTestTeacherPassword`, this.externals.wixSecretsBackend.getSecret('TEST_API_PASSWORD'));
    }
}
