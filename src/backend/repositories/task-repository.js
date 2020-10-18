import { fetchRecords, findSingleRecordOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const TASKS_COLLECTION = 'Tasks';
export class TaskRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchAllTasks() {
        return withLogger(`fetchTasks`, fetchRecords(this.externals.wixData.query(TASKS_COLLECTION).ascending('number').find()));
    }
    fetchTaskByNumberOrThrow(taskNumber) {
        return withLogger(`fetchTaskByNumberOrThrow`, findSingleRecordOrThrow(this.externals.wixData
            .query(TASKS_COLLECTION)
            .eq('number', taskNumber)
            .limit(1)
            .find({ suppressAuth: true })));
    }
}
