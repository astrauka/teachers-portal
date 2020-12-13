import { TaskView } from './common/entities/task';
import { RegisteredTeachersInfo } from './common/entities/teachers-info';
import {
  InitialTeacherForm,
  SecondStepTeachersForm,
  TeachersProfile,
  TeachersProfileView,
} from './common/entities/teachers-profile';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { withLogger } from './utils/logger';

export async function loginWithGoogle(idToken: string): Promise<string> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger('loginWithGoogle', actions.authenticateTeacher(idToken));
}

export async function currentTeachersInfo(): Promise<RegisteredTeachersInfo> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger('currentTeachersInfo', actions.getCurrentTeachersInfo());
}

export async function currentTeachersProfile(): Promise<TeachersProfileView | undefined> {
  const { actions, views } = await setupContext(EXTERNALS);
  return withLogger('getTeachersProfile', async () => {
    const teachersProfile = await actions.getTeachersProfile();
    const [teachersProfileView] = await views.makeTeachersProfileViews([teachersProfile]);
    return teachersProfileView;
  });
}

export async function updateInitialTeachersProfile(
  update: InitialTeacherForm
): Promise<TeachersProfile> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger('updateInitialTeachersProfile', actions.updateInitialTeachersProfile(update));
}

export async function updateSecondStepTeachersProfile(
  update: SecondStepTeachersForm
): Promise<TeachersProfile> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger(
    'updateSecondStepTeachersProfile',
    actions.updateSecondStepTeachersProfile(update)
  );
}

export async function currentTeachersTasks(): Promise<TaskView[]> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger('currentTeachersTasks', actions.getCurrentTeachersTasks());
}

export async function curatingTeachersProfile(): Promise<TeachersProfile | undefined> {
  const { actions } = await setupContext(EXTERNALS);
  return withLogger('curatingTeachersProfile', actions.getCuratingTeachersProfile());
}
