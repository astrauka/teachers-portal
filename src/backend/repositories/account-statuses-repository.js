import { fetchRecords } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const ACCOUNT_STATUSES_COLLECTION = 'AccountStatuses';
export class AccountStatusesRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchAccountStatuses() {
        return withLogger('fetchAccountStatuses', fetchRecords(this.externals.wixData.query(ACCOUNT_STATUSES_COLLECTION).find({ suppressAuth: true })));
    }
}
