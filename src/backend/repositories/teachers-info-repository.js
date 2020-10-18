import { fetchRecords, findById, findSingleRecord } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
export const TEACHERS_INFO_COLLECTION = 'TeachersInfo';
const TEACHERS_TASKS = 'completedTasks';
export class TeachersInfoRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchTeacherById(id) {
        return withLogger(`fetchTeacherById ${id}`, findById(this.externals, TEACHERS_INFO_COLLECTION, id));
    }
    fetchTeacherByEmail(email) {
        return withLogger(`fetchTeacherByEmail ${email}`, findSingleRecord(this.externals.wixData.query(TEACHERS_INFO_COLLECTION).eq('email', email).find()));
    }
    async updateTeacher(teachersInfo) {
        return withLogger(`updateTeacher ${teachersInfo.email}`, this.externals.wixData.update(TEACHERS_INFO_COLLECTION, teachersInfo));
    }
    async fetchCompletedTasks(teachersInfo) {
        return withLogger(`fetchCompletedTasks ${teachersInfo.email}`, fetchRecords(this.externals.wixData.queryReferenced(TEACHERS_INFO_COLLECTION, teachersInfo._id, TEACHERS_TASKS, { order: 'asc' })));
    }
    async completeTask(teachersInfo, task) {
        return withLogger(`completeTask ${teachersInfo.email} ${task.number}`, this.externals.wixData.insertReference(TEACHERS_INFO_COLLECTION, TEACHERS_TASKS, teachersInfo._id, task._id, { suppressAuth: true }));
    }
}
