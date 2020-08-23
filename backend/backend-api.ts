import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { TaskView } from './types/task';
import { RegisteredTeachersInfo } from './types/teachers-info';
import { TeachersProfile, TeachersProfileUpdate } from './types/teachers-profile';
import { withLogger } from './utils/logger';

export async function loginWithGoogle(idToken: string): Promise<string> {
  const {
    actions: { authenticateTeacher },
  } = await setupContext(EXTERNALS);
  return withLogger('loginWithGoogle', authenticateTeacher(idToken));
}

export async function currentTeachersInfo(): Promise<RegisteredTeachersInfo> {
  const {
    actions: { getCurrentTeachersInfo },
  } = await setupContext(EXTERNALS);
  return withLogger('currentTeachersInfo', getCurrentTeachersInfo());
}

export async function currentTeachersProfile(): Promise<TeachersProfile | undefined> {
  const {
    actions: { getCurrentTeachersProfile },
  } = await setupContext(EXTERNALS);
  return withLogger('currentTeachersProfile', getCurrentTeachersProfile());
}

export async function updateTeachersProfile(
  update: TeachersProfileUpdate
): Promise<TeachersProfile> {
  const {
    actions: { updateCurrentTeachersProfile },
  } = await setupContext(EXTERNALS);
  return withLogger('updateTeachersProfile', updateCurrentTeachersProfile(update));
}

export async function currentTeachersTasks(): Promise<TaskView[]> {
  const {
    actions: { getCurrentTeachersTasks },
  } = await setupContext(EXTERNALS);
  return withLogger('currentTeachersTasks', getCurrentTeachersTasks());
}
