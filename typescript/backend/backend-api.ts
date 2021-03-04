import { MakeTeacherViews } from './business-logic/views/make-teacher-views';
import {
  AccountStatus,
  InitialTeacherForm,
  SecondStepTeachersForm,
  Teacher,
  TeacherView,
} from './common/entities/teacher';
import { context } from './context/setup-context';
import { withLogger } from './utils/logger';

export async function getCurrentTeacherView(): Promise<TeacherView | undefined> {
  const { actions, views } = context;
  return withLogger(
    'getCurrentTeacherView',
    getTeacherView(actions.getTeacher({ throwOnNotFound: true }), views.makeTeacherViews)
  );
}

export async function submitInitialTeachersForm(update: InitialTeacherForm): Promise<TeacherView> {
  const { actions, views } = context;
  return withLogger(
    'submitInitialTeachersForm',
    getTeacherView(actions.submitInitialTeachersForm(update), views.makeTeacherViews)
  );
}

export async function submitSecondStepTeachersForm(
  update: SecondStepTeachersForm
): Promise<TeacherView> {
  const { actions, views } = context;
  return withLogger(
    'submitSecondStepTeachersForm',
    getTeacherView(actions.submitSecondStepTeachersForm(update), views.makeTeacherViews)
  );
}

export async function getCuratingTeacherView(): Promise<TeacherView | undefined> {
  const { actions, views } = context;
  return withLogger(
    'getCuratingTeacherView',
    getTeacherView(actions.getCuratingTeacher(), views.makeTeacherViews)
  );
}

export async function getAllAccountStatuses(): Promise<AccountStatus[]> {
  const { repositories } = context;
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
