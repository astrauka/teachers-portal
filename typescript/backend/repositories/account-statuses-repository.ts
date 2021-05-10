import { Externals } from '../context/production-context';
import { AccountStatus } from '../universal/entities/teacher';
import { fetchRecords } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const ACCOUNT_STATUSES_COLLECTION = 'AccountStatuses';

export class AccountStatusesRepository {
  constructor(private readonly externals: Externals) {}

  public fetchAccountStatuses(): Promise<AccountStatus[]> {
    return withLogger(
      'fetchAccountStatuses',
      fetchRecords<AccountStatus>(
        this.externals.wixData.query(ACCOUNT_STATUSES_COLLECTION).find({ suppressAuth: true })
      )
    );
  }
}
