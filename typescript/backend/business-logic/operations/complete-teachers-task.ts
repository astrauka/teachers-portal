import { TaskNumber } from '../../common/entities/task';
import { TaskRepository } from '../../repositories/task-repository';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';

export function completeTeachersTaskFactory(
  getCurrentTeachersInfo: GetCurrentTeachersInfo,
  teachersInfoRepository: TeachersInfoRepository,
  taskRepository: TaskRepository
) {
  return async function completeTeachersTask(taskNumber: TaskNumber): Promise<void> {
    const teachersInfo = await getCurrentTeachersInfo();
    const task = await taskRepository.fetchTaskByNumberOrThrow(taskNumber);
    const completedTasks = await teachersInfoRepository.fetchCompletedTasks(teachersInfo);
    if (completedTasks.find((completedTask) => completedTask.number === taskNumber)) {
      return;
    } else {
      return teachersInfoRepository.completeTask(teachersInfo, task);
    }
  };
}

export type CompleteTeachersTask = ReturnType<typeof completeTeachersTaskFactory>;
