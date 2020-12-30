import { TaskNumber } from '../../common/entities/task';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { GetTeacher } from './get-teacher';

export function completeTeachersTaskFactory(
  getTeacher: GetTeacher,
  teachersRepository: TeachersRepository,
  tasksRepository: TasksRepository
) {
  return async function completeTeachersTask(taskNumber: TaskNumber): Promise<void> {
    const teacher = await getTeacher();
    const task = await tasksRepository.fetchTaskByNumberOrThrow(taskNumber);
    const completedTasks = await teachersRepository.fetchCompletedTasks(teacher);
    if (completedTasks.find((completedTask) => completedTask.number === taskNumber)) {
      return;
    } else {
      return teachersRepository.completeTask(teacher, task);
    }
  };
}

export type CompleteTeachersTask = ReturnType<typeof completeTeachersTaskFactory>;
