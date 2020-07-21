import { Externals } from '../context/production-context';
import { Task, TaskNumber } from '../types/task';
import { fetchRecords, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const TASKS_COLLECTION = 'Tasks';

export class TaskRepository {
  constructor(private readonly externals: Externals) {}

  public fetchAllTasks(): Promise<Task[]> {
    return withLogger(
      `fetchTasks`,
      fetchRecords(this.externals.wixData.query(TASKS_COLLECTION).ascending('number').find())
    );
  }

  public fetchTaskByNumberSafe(taskNumber: TaskNumber): Promise<Task> {
    return withLogger(
      `fetchTaskByNumberSafe`,
      findSingleRecordSafe(
        this.externals.wixData
          .query(TASKS_COLLECTION)
          .eq('number', taskNumber)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
