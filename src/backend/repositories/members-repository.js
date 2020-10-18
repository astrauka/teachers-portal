import { findById, findSingleRecord } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const MEMBERS_COLLECTION = 'Members/PrivateMembersData';
export class MembersRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchMemberByEmail(email) {
        return withLogger(`fetchMemberByEmail ${email}`, findSingleRecord(this.externals.wixData
            .query(MEMBERS_COLLECTION)
            .eq('loginEmail', email)
            .limit(1)
            .find({ suppressAuth: true })));
    }
    fetchMemberById(id) {
        return withLogger(`fetchMemberById ${id}`, findById(this.externals, MEMBERS_COLLECTION, id));
    }
}
