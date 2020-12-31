import { keyBy } from 'lodash';
import { TaskView } from '../../common/entities/task';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { GetTeacher } from './get-teacher';

export function getTeachersTasksFactory(
  tasksRepository: TasksRepository,
  teachersRepository: TeachersRepository,
  getTeacher: GetTeacher
) {
  return async function getTeachersTasks(): Promise<TaskView[]> {
    const [tasks, teacher] = await Promise.all([tasksRepository.fetchAllTasks(), getTeacher()]);
    const completedTasks = keyBy(await teachersRepository.fetchCompletedTasks(teacher), '_id');
    return tasks.map((task) => ({ ...task, isCompleted: Boolean(completedTasks[task._id]) }));
  };
}
