import { buildTask } from '../../../test/builders/task';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { Task } from '../../common/entities/task';
import { Teacher } from '../../common/entities/teacher';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { completeTeachersTaskFactory } from './complete-teachers-task';
import { GetTeacher } from './get-teacher';

describe('completeTeachersTask', () => {
  const task = buildTask();
  const teacher = buildTeacher();
  const completedTasks = [];

  const getGetTeacher = (teacher: Teacher) => stubFn<GetTeacher>().resolves(teacher);
  const getTeachersRepository = (completedTasks: Task[]) =>
    createStubInstance(TeachersRepository, (stub) => {
      stub.completeTask.resolves();
      stub.fetchCompletedTasks.resolves(completedTasks);
    });
  const getTasksRepository = (task: Task) =>
    createStubInstance(TasksRepository, (stub) => {
      stub.fetchTaskByNumberOrThrow.resolves(task);
    });
  const buildTestContext = ({
    getTeacher = getGetTeacher(teacher),
    teachersRepository = getTeachersRepository(completedTasks),
    tasksRepository = getTasksRepository(task),
  } = {}) => ({
    getTeacher,
    teachersRepository,
    tasksRepository,
    completeTeachersTask: completeTeachersTaskFactory(
      getTeacher,
      teachersRepository,
      tasksRepository
    ),
  });

  it('should mark task as done', async () => {
    const {
      getTeacher,
      teachersRepository,
      tasksRepository,
      completeTeachersTask,
    } = buildTestContext();
    await completeTeachersTask(task.number);
    expect(getTeacher).calledOnceWithExactly();
    expect(tasksRepository.fetchTaskByNumberOrThrow).calledOnceWithExactly(task.number);
    expect(teachersRepository.fetchCompletedTasks).calledOnceWithExactly(teacher);
    expect(teachersRepository.completeTask).calledOnceWithExactly(teacher, task);
  });

  context('on task completed', () => {
    const completedTasks = [task];

    it('should do nothing', async () => {
      const {
        getTeacher,
        teachersRepository,
        tasksRepository,
        completeTeachersTask,
      } = buildTestContext({ teachersRepository: getTeachersRepository(completedTasks) });
      await completeTeachersTask(task.number);
      expect(getTeacher).calledOnceWithExactly();
      expect(tasksRepository.fetchTaskByNumberOrThrow).calledOnceWithExactly(task.number);
      expect(teachersRepository.completeTask).not.called;
    });
  });
});
