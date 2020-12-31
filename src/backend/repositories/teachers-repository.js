import { fetchRecords, findById, findSingleRecord, findSingleRecordOrThrow, } from '../utils/database-queries';
import { NotLoggedInError } from '../utils/errors';
import { withLogger } from '../utils/logger';
const TEACHERS_COLLECTION = 'TeachersProfile';
const COMPLETED_TASKS_FIELD = 'completedTasks';
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
    async fetchCompletedTasks(teacher) {
        return withLogger(`fetchCompletedTasks ${teacher.email}`, fetchRecords(this.externals.wixData.queryReferenced(TEACHERS_COLLECTION, teacher._id, COMPLETED_TASKS_FIELD, { order: 'asc' })));
    }
    async completeTask(teacher, task) {
        return withLogger(`completeTask ${teacher.email} ${task.number}`, this.externals.wixData.insertReference(TEACHERS_COLLECTION, COMPLETED_TASKS_FIELD, teacher._id, task._id, { suppressAuth: true }));
    }
}
