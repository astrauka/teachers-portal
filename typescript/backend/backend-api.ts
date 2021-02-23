import { MakeTeacherViews } from './business-logic/views/make-teacher-views';
import {
  AccountStatus,
  InitialTeacherForm,
  SecondStepTeachersForm,
  Teacher,
  TeacherView,
} from './common/entities/teacher';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { withLogger } from './utils/logger';

export async function loginWithGoogle(idToken: string): Promise<string> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger('loginWithGoogle', actions.authenticateTeacher(idToken));
}

export async function getCurrentTeacherView(): Promise<TeacherView | undefined> {
  const { actions, views } = await setupContext(EXTERNALS);
  return withLogger(
    'getCurrentTeacherView',
    getTeacherView(actions.getTeacher({ throwOnNotFound: true }), views.makeTeacherViews)
  );
}

export async function submitInitialTeachersForm(update: InitialTeacherForm): Promise<TeacherView> {
  const { actions, views } = await setupContext(EXTERNALS);
  return withLogger(
    'submitInitialTeachersForm',
    getTeacherView(actions.submitInitialTeachersForm(update), views.makeTeacherViews)
  );
}

export async function submitSecondStepTeachersForm(
  update: SecondStepTeachersForm
): Promise<TeacherView> {
  const { actions, views } = await setupContext(EXTERNALS);
  return withLogger(
    'submitSecondStepTeachersForm',
    getTeacherView(actions.submitSecondStepTeachersForm(update), views.makeTeacherViews)
  );
}

export async function getCuratingTeacherView(): Promise<TeacherView | undefined> {
  const { actions, views } = await setupContext(EXTERNALS);
  return withLogger(
    'getCuratingTeacherView',
    getTeacherView(actions.getCuratingTeacher(), views.makeTeacherViews)
  );
}

export async function getAllAccountStatuses(): Promise<AccountStatus[]> {
  const { repositories } = await setupContext(EXTERNALS);
  return withLogger(
    'getAllAccountStatuses',
    repositories.accountStatusesRepository.fetchAccountStatuses()
  );
}

async function getTeacherView(
  teacherPromise: Promise<Teacher>,
  makeTeacherViews: MakeTeacherViews
): Promise<TeacherView> {
  const [teacherView] = await makeTeacherViews([await teacherPromise]);
  return teacherView;
}
