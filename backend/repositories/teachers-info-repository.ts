import { Externals } from '../context/production-context';
import { Task } from '../types/task';
import { TeachersInfo } from '../types/teachers-info';
import { fetchRecords, findSingleRecord, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const TEACHERS_INFO_COLLECTION = 'TeachersInfo';
const TEACHERS_TASKS = 'completedTasks';

export class TeachersInfoRepository {
  constructor(private readonly externals: Externals) {}

  public fetchTeacherByUserId(userId: string): Promise<TeachersInfo> {
    return withLogger(
      `fetchTeacherByUserId ${userId}`,
      findSingleRecord(
        this.externals.wixData.query(TEACHERS_INFO_COLLECTION).eq('userId', userId).find()
      )
    );
  }

  public fetchTeacherByEmail(email: string): Promise<TeachersInfo> {
    return withLogger(
      `fetchTeacherByEmail ${email}`,
      findSingleRecord(
        this.externals.wixData.query(TEACHERS_INFO_COLLECTION).eq('email', email).find()
      )
    );
  }

  public fetchTeacherByEmailSafe(email: string): Promise<TeachersInfo | undefined> {
    return withLogger(
      `fetchTeacherByEmailSafe ${email}`,
      findSingleRecordSafe(
        this.externals.wixData.query(TEACHERS_INFO_COLLECTION).eq('email', email).find()
      )
    );
  }

  public async updateTeacher(teachersInfo: TeachersInfo): Promise<TeachersInfo> {
    return withLogger(
      `updateTeacher ${teachersInfo.email}`,
      this.externals.wixData.update(TEACHERS_INFO_COLLECTION, teachersInfo)
    );
  }

  public async fetchCompletedTasks(teachersInfo: TeachersInfo): Promise<Task[]> {
    return withLogger(
      `fetchCompletedTasks ${teachersInfo.email}`,
      fetchRecords(
        this.externals.wixData.queryReferenced(
          TEACHERS_INFO_COLLECTION,
          teachersInfo._id,
          TEACHERS_TASKS,
          { order: 'asc' }
        )
      )
    );
  }

  public async completeTask(teachersInfo: TeachersInfo, task: Task): Promise<void> {
    return withLogger(
      `completeTask ${teachersInfo.email} ${task.number}`,
      this.externals.wixData.insertReference(
        TEACHERS_INFO_COLLECTION,
        TEACHERS_TASKS,
        teachersInfo._id,
        task._id,
        { suppressAuth: true }
      )
    );
  }
}
