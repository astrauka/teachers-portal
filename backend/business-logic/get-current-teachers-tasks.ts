import { keyBy } from 'lodash';
import { TaskRepository } from '../repositories/task-repository';
import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { TaskView } from '../types/task';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';

export function getCurrentTeachersTasksFactory(
  taskRepository: TaskRepository,
  teachersInfoRepository: TeachersInfoRepository,
  getCurrentTeachersInfo: GetCurrentTeachersInfo
) {
  return async function getCurrentTeachersTasks(): Promise<TaskView[]> {
    const [tasks, teachersInfo] = await Promise.all([
      taskRepository.fetchAllTasks(),
      getCurrentTeachersInfo(),
    ]);
    const completedTasks = keyBy(
      await teachersInfoRepository.fetchCompletedTasks(teachersInfo),
      '_id'
    );
    return tasks.map((task) => ({ ...task, isCompleted: Boolean(completedTasks[task._id]) }));
  };
}
