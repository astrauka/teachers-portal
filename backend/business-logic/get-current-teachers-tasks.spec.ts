import { buildTask } from '../../test/builders/task';
import { buildTeachersInfo } from '../../test/builders/teachers-info';
import { expect } from '../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../test/utils/stubbing';
import { TaskRepository } from '../repositories/task-repository';
import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { Task } from '../types/task';
import { TeachersInfo } from '../types/teachers-info';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';
import { getCurrentTeachersTasksFactory } from './get-current-teachers-tasks';

describe('getCurrentTeachersTasks', () => {
  const teachersInfo = buildTeachersInfo({ id: 'teacher' });
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
  const getGetCurrentTeachersInfo = (teachersInfo: TeachersInfo) =>
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

  it('should return current teacher profile', async () => {
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
});
