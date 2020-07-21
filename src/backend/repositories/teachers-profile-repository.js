import { findSingleRecord } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const TEACHERS_PROFILE_COLLECTION = 'TeachersProfile';
export class TeachersProfileRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchTeachersProfileByEmail(email) {
        return withLogger(`fetchTeachersProfileByEmail ${email}`, findSingleRecord(this.externals.wixData
            .query(TEACHERS_PROFILE_COLLECTION)
            .eq('email', email)
            .limit(1)
            .find({ suppressAuth: true })));
    }
    async updateTeachersProfile(teachersProfile) {
        return withLogger(`updateTeachersProfile ${teachersProfile.email}`, this.externals.wixData.update(TEACHERS_PROFILE_COLLECTION, teachersProfile, {
            suppressAuth: true,
        }));
    }
    async insertTeachersProfile(teachersProfile) {
        return withLogger(`insertTeachersProfile ${teachersProfile.email}`, this.externals.wixData.insert(TEACHERS_PROFILE_COLLECTION, teachersProfile, {
            suppressAuth: true,
        }));
    }
}
