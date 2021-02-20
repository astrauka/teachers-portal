import { findById, findSingleRecord, findSingleRecordOrThrow } from '../utils/database-queries';
import { NotLoggedInError } from '../utils/errors';
import { withLogger } from '../utils/logger';
const TEACHERS_COLLECTION = 'TeachersProfile';
export class TeachersRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchTeacherById(id) {
        return withLogger(`fetchTeacherById ${id}`, findById(this.externals, TEACHERS_COLLECTION, id));
    }
    fetchTeacherByEmail(email) {
        if (email) {
            return withLogger(`fetchTeacherByEmail ${email}`, findSingleRecord(this.externals.wixData
                .query(TEACHERS_COLLECTION)
                .eq('email', email)
                .limit(1)
                .find({ suppressAuth: true })));
        }
        return undefined;
    }
    fetchTeacherByEmailOrThrow(email) {
        if (!email) {
            throw new NotLoggedInError();
        }
        return withLogger(`fetchTeacherByEmail ${email}`, findSingleRecordOrThrow(this.externals.wixData
            .query(TEACHERS_COLLECTION)
            .eq('email', email)
            .limit(1)
            .find({ suppressAuth: true })));
    }
    fetchTeacherBySlug(slug) {
        if (slug) {
            return withLogger(`fetchTeacherBySlug ${slug}`, findSingleRecord(this.externals.wixData
                .query(TEACHERS_COLLECTION)
                .eq('slug', slug)
                .limit(1)
                .find({ suppressAuth: true })));
        }
        return undefined;
    }
    async updateTeacher(teacher) {
        return withLogger(`updateTeacher ${teacher.email}`, this.externals.wixData.update(TEACHERS_COLLECTION, teacher, {
            suppressAuth: true,
        }));
    }
}
