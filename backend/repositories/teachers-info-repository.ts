import { Externals } from '../context/production-context';
import { Task } from '../types/task';
import { RegisteredTeachersInfo, TeachersInfo } from '../types/teachers-info';
import {
  fetchRecords,
  findById,
  findSingleRecord,
  findSingleRecordSafe,
} from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const TEACHERS_INFO_COLLECTION = 'TeachersInfo';
const TEACHERS_TASKS = 'completedTasks';

export class TeachersInfoRepository {
  constructor(private readonly externals: Externals) {}

  public fetchTeacherById<T = RegisteredTeachersInfo>(id: string): Promise<T | undefined> {
    return withLogger(
      `fetchTeacherById ${id}`,
      findById<T>(this.externals, TEACHERS_INFO_COLLECTION, id)
    );
  }

  public fetchTeacherByEmail<T = RegisteredTeachersInfo>(email: string): Promise<T | undefined> {
    return withLogger(
      `fetchTeacherByEmail ${email}`,
      findSingleRecord(
        this.externals.wixData.query(TEACHERS_INFO_COLLECTION).eq('email', email).find()
      )
    );
  }

  public fetchTeacherByEmailSafe<T = RegisteredTeachersInfo>(email: string): Promise<T> {
    return withLogger(
      `fetchTeacherByEmailSafe ${email}`,
      findSingleRecordSafe(
        this.externals.wixData.query(TEACHERS_INFO_COLLECTION).eq('email', email).find()
      )
    );
  }

  public async updateTeacher(
    teachersInfo: RegisteredTeachersInfo
  ): Promise<RegisteredTeachersInfo> {
    return withLogger(
      `updateTeacher ${teachersInfo.email}`,
      this.externals.wixData.update(TEACHERS_INFO_COLLECTION, teachersInfo)
    );
  }

  public async fetchCompletedTasks(teachersInfo: RegisteredTeachersInfo): Promise<Task[]> {
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

  public async completeTask(teachersInfo: RegisteredTeachersInfo, task: Task): Promise<void> {
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
