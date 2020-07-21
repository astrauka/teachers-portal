import { Externals } from '../context/production-context';
import { Member } from '../types/wix-types';
import { findById, findSingleRecord, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const MEMBERS_COLLECTION = 'Members/PrivateMembersData';

export class MembersRepository {
  constructor(private readonly externals: Externals) {}

  public fetchMemberByEmailSafe(email: string): Promise<Member | undefined> {
    return withLogger(
      `fetchMemberByEmailSafe ${email}`,
      findSingleRecordSafe(
        this.externals.wixData
          .query(MEMBERS_COLLECTION)
          .eq('loginEmail', email)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }

  public fetchMemberByEmail(email: string): Promise<Member> {
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

  public fetchMemberById(id: string): Promise<Member> {
    return withLogger(`fetchMemberById ${id}`, findById(this.externals, MEMBERS_COLLECTION, id));
  }
}
