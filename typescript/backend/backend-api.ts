import {
  AccountStatus,
  InitialTeacherForm,
  SecondStepTeachersForm,
  TeacherView,
} from './common/entities/teacher';
import { context } from './context/setup-context';
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
  const { actions, hooks } = context;
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
