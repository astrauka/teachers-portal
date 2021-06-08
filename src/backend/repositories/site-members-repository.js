import { findSingleRecord } from '../utils/database-queries';
import { throwOnNotProvided } from '../utils/errors';
import { withLogger } from '../utils/logger';
const MEMBERS_COLLECTION = 'Members/PrivateMembersData';
export class SiteMembersRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchMemberByEmail(email) {
        return withLogger(`fetchMemberByEmail ${email}`, () => {
            throwOnNotProvided(email, 'fetchMemberByEmail: email not provided');
            return findSingleRecord(this.externals.wixData
                .query(MEMBERS_COLLECTION)
                .eq('loginEmail', email)
                .limit(1)
                .find({ suppressAuth: true }));
        });
    }
}
