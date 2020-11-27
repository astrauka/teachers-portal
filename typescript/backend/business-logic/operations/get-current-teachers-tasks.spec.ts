import { buildTask } from '../../../test/builders/task';
import { buildRegisteredTeachersInfo } from '../../../test/builders/teachers-info';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { Task } from '../../common/entities/task';
import { RegisteredTeachersInfo } from '../../common/entities/teachers-info';
import { TaskRepository } from '../../repositories/task-repository';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { NotLoggedInError } from '../../utils/errors';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';
import { getCurrentTeachersTasksFactory } from './get-current-teachers-tasks';

describe('getCurrentTeachersTasks', () => {
  const teachersInfo = buildRegisteredTeachersInfo({ id: 'teacher' });
  const completedTask = buildTask({ id: 'completed', properties: { number: 1 } });
  const notCompletedTask = buildTask({ id: 'not-completed', properties: { number: 2 } });
  const tasks = [completedTask, notCompletedTask];

  const getTaskRepository = (tasks: Task[]) =>
    createStubInstance(TaskRepository, (stub) => {
      stub.fetchAllTasks.resolves(tasks);
    });
  const getTeachersInfoRepository = (completedTasks: Task[]) =>
    createStubInstance(TeachersInfoRepository, (stub) => {
      stub.fetchCompletedTasks.resolves(completedTasks);
    });
  const getGetCurrentTeachersInfo = (teachersInfo: RegisteredTeachersInfo) =>
    stubFn<GetCurrentTeachersInfo>().resolves(teachersInfo);
  const buildTestContext = ({
    taskRepository = getTaskRepository(tasks),
    teachersInfoRepository = getTeachersInfoRepository([completedTask]),
    getCurrentTeachersInfo = getGetCurrentTeachersInfo(teachersInfo),
  } = {}) => ({
    taskRepository,
    teachersInfoRepository,
    getCurrentTeachersInfo,
    getCurrentTeachersTasks: getCurrentTeachersTasksFactory(
      taskRepository,
      teachersInfoRepository,
      getCurrentTeachersInfo
    ),
  });

  it('should return current teacher tasks', async () => {
    const {
      taskRepository,
      teachersInfoRepository,
      getCurrentTeachersInfo,
      getCurrentTeachersTasks,
    } = buildTestContext();
    expect(await getCurrentTeachersTasks()).to.eql([
      {
        ...completedTask,
        isCompleted: true,
      },
      {
        ...notCompletedTask,
        isCompleted: false,
      },
    ]);
    expect(taskRepository.fetchAllTasks).calledOnceWithExactly();
    expect(getCurrentTeachersInfo).calledOnceWithExactly();
    expect(teachersInfoRepository.fetchCompletedTasks).calledOnceWithExactly(teachersInfo);
  });

  context('on current teacher not logged in', () => {
    const error = new NotLoggedInError();
    const getGetCurrentTeachersInfo = () => stubFn<GetCurrentTeachersInfo>().rejects(error);

    it('should throw', async () => {
      const {
        taskRepository,
        teachersInfoRepository,
        getCurrentTeachersInfo,
        getCurrentTeachersTasks,
      } = buildTestContext({ getCurrentTeachersInfo: getGetCurrentTeachersInfo() });
      await expect(getCurrentTeachersTasks()).rejectedWith('Not logged in');
      expect(taskRepository.fetchAllTasks).calledOnceWithExactly();
      expect(getCurrentTeachersInfo).calledOnceWithExactly();
      expect(teachersInfoRepository.fetchCompletedTasks).not.called;
    });
  });
});
