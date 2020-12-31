import { buildTask } from '../../../test/builders/task';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { Task } from '../../common/entities/task';
import { Teacher } from '../../common/entities/teacher';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { NotLoggedInError } from '../../utils/errors';
import { getTeachersTasksFactory } from './get-current-teachers-tasks';
import { GetTeacher } from './get-teacher';

describe('getTeachersTasks', () => {
  const teacher = buildTeacher({ id: 'teacher' });
  const completedTask = buildTask({ id: 'completed', properties: { number: 1 } });
  const notCompletedTask = buildTask({ id: 'not-completed', properties: { number: 2 } });
  const tasks = [completedTask, notCompletedTask];

  const getTasksRepository = (tasks: Task[]) =>
    createStubInstance(TasksRepository, (stub) => {
      stub.fetchAllTasks.resolves(tasks);
    });
  const getTeachersRepository = (completedTasks: Task[]) =>
    createStubInstance(TeachersRepository, (stub) => {
      stub.fetchCompletedTasks.resolves(completedTasks);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetTeacher>().resolves(teacher);
  const buildTestContext = ({
    tasksRepository = getTasksRepository(tasks),
    teachersRepository = getTeachersRepository([completedTask]),
    getTeacher = getGetTeacher(teacher),
  } = {}) => ({
    tasksRepository,
    teachersRepository,
    getTeacher,
    getTeachersTasks: getTeachersTasksFactory(tasksRepository, teachersRepository, getTeacher),
  });

  it('should return current teacher tasks', async () => {
    const {
      tasksRepository,
      teachersRepository,
      getTeacher,
      getTeachersTasks,
    } = buildTestContext();
    expect(await getTeachersTasks()).to.eql([
      {
        ...completedTask,
        isCompleted: true,
      },
      {
        ...notCompletedTask,
        isCompleted: false,
      },
    ]);
    expect(tasksRepository.fetchAllTasks).calledOnceWithExactly();
    expect(getTeacher).calledOnceWithExactly();
    expect(teachersRepository.fetchCompletedTasks).calledOnceWithExactly(teacher);
  });

  context('on current teacher not logged in', () => {
    const error = new NotLoggedInError();
    const getGetTeacher = () => stubFn<GetTeacher>().rejects(error);

    it('should throw', async () => {
      const {
        tasksRepository,
        teachersRepository,
        getTeacher,
        getTeachersTasks,
      } = buildTestContext({ getTeacher: getGetTeacher() });
      await expect(getTeachersTasks()).rejectedWith('Not logged in');
      expect(tasksRepository.fetchAllTasks).calledOnceWithExactly();
      expect(getTeacher).calledOnceWithExactly();
      expect(teachersRepository.fetchCompletedTasks).not.called;
    });
  });
});
