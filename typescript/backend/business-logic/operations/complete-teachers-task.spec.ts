import { buildTask } from '../../../test/builders/task';
import { buildRegisteredTeachersInfo } from '../../../test/builders/teachers-info';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { Task } from '../../common/entities/task';
import { RegisteredTeachersInfo } from '../../common/entities/teachers-info';
import { TaskRepository } from '../../repositories/task-repository';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { completeTeachersTaskFactory } from './complete-teachers-task';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';

describe('completeTeachersTask', () => {
  const task = buildTask();
  const teachersInfo = buildRegisteredTeachersInfo();
  const completedTasks = [];

  const getGetCurrentTeachersInfo = (teachersInfo: RegisteredTeachersInfo) =>
    stubFn<GetCurrentTeachersInfo>().resolves(teachersInfo);
  const getTeachersInfoRepository = (completedTasks: Task[]) =>
    createStubInstance(TeachersInfoRepository, (stub) => {
      stub.completeTask.resolves();
      stub.fetchCompletedTasks.resolves(completedTasks);
    });
  const getTaskRepository = (task: Task) =>
    createStubInstance(TaskRepository, (stub) => {
      stub.fetchTaskByNumberOrThrow.resolves(task);
    });
  const buildTestContext = ({
    getCurrentTeachersInfo = getGetCurrentTeachersInfo(teachersInfo),
    teachersInfoRepository = getTeachersInfoRepository(completedTasks),
    taskRepository = getTaskRepository(task),
  } = {}) => ({
    getCurrentTeachersInfo,
    teachersInfoRepository,
    taskRepository,
    completeTeachersTask: completeTeachersTaskFactory(
      getCurrentTeachersInfo,
      teachersInfoRepository,
      taskRepository
    ),
  });

  it('should mark task as done', async () => {
    const {
      getCurrentTeachersInfo,
      teachersInfoRepository,
      taskRepository,
      completeTeachersTask,
    } = buildTestContext();
    await completeTeachersTask(task.number);
    expect(getCurrentTeachersInfo).calledOnceWithExactly();
    expect(taskRepository.fetchTaskByNumberOrThrow).calledOnceWithExactly(task.number);
    expect(teachersInfoRepository.fetchCompletedTasks).calledOnceWithExactly(teachersInfo);
    expect(teachersInfoRepository.completeTask).calledOnceWithExactly(teachersInfo, task);
  });

  context('on task completed', () => {
    const completedTasks = [task];

    it('should do nothing', async () => {
      const {
        getCurrentTeachersInfo,
        teachersInfoRepository,
        taskRepository,
        completeTeachersTask,
      } = buildTestContext({ teachersInfoRepository: getTeachersInfoRepository(completedTasks) });
      await completeTeachersTask(task.number);
      expect(getCurrentTeachersInfo).calledOnceWithExactly();
      expect(taskRepository.fetchTaskByNumberOrThrow).calledOnceWithExactly(task.number);
      expect(teachersInfoRepository.completeTask).not.called;
    });
  });
});
