import { context } from './context/setup-context';
import {
  AccountStatus,
  InitialTeacherForm,
  SecondStepTeachersForm,
  Teacher,
  TeacherView,
} from './universal/entities/teacher';
import { withLogger } from './utils/logger';

export async function getCurrentTeacherView(): Promise<TeacherView> {
  const { actions } = context;
  return withLogger('getCurrentTeacherView', actions.getCurrentTeacher());
}

export async function submitInitialTeachersForm(update: InitialTeacherForm): Promise<TeacherView> {
  const { actions } = context;
  return withLogger('submitInitialTeachersForm', actions.submitInitialTeachersForm(update));
}

export async function submitSecondStepTeachersForm(
  update: SecondStepTeachersForm
): Promise<TeacherView> {
  const { actions } = context;
  return withLogger('submitSecondStepTeachersForm', actions.submitSecondStepTeachersForm(update));
}

export async function getCuratingTeacherView(): Promise<TeacherView | undefined> {
  const { actions } = context;
  return withLogger('getCuratingTeacherView', actions.getCuratingTeacher());
}

export async function getAllAccountStatuses(): Promise<AccountStatus[]> {
  const { repositories } = context;
  return withLogger(
    'getAllAccountStatuses',
    repositories.accountStatusesRepository.fetchAccountStatuses()
  );
}

export async function resetTestTeacher(): Promise<{ teacher: Teacher; sessionToken: string }> {
  const { actions, services } = context;
  return withLogger('resetTestTeacher', async () => {
    await actions.cleanTestTeacher();
    const teacher = await actions.createTestTeacher();
    const sessionToken = await services.usersService.generateSessionToken(teacher);
    return { teacher, sessionToken };
  });
}
