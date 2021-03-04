import { Externals } from '../context/production-context';
import { SiteMember } from '../types/wix-types';
import { findSingleRecord } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const MEMBERS_COLLECTION = 'Members/PrivateMembersData';

export class SiteMembersRepository {
  constructor(private readonly externals: Externals) {}

  public fetchMemberByEmail(email: string): Promise<SiteMember> {
    return withLogger(
      `fetchMemberByEmail ${email}`,
      findSingleRecord(
        this.externals.wixData
          .query(MEMBERS_COLLECTION)
          .eq('loginEmail', email)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
