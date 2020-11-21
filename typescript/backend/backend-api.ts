import { TaskView } from './common/entities/task';
import { RegisteredTeachersInfo } from './common/entities/teachers-info';
import {
  TeachersProfile,
  TeachersProfileUpdate,
  TeachersProfileView,
} from './common/entities/teachers-profile';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
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

export async function currentTeachersProfile(): Promise<TeachersProfileView | undefined> {
  const {
    actions: { getTeachersProfile },
    views: { makeTeachersProfileViews },
  } = await setupContext(EXTERNALS);
  return withLogger('getTeachersProfile', async () => {
    const teachersProfile = await getTeachersProfile();
    const [teachersProfileView] = await makeTeachersProfileViews([teachersProfile]);
    return teachersProfileView;
  });
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

export async function curatingTeachersProfile(): Promise<TeachersProfile | undefined> {
  const {
    actions: { getCuratingTeachersProfile },
  } = await setupContext(EXTERNALS);
  return withLogger('curatingTeachersProfile', getCuratingTeachersProfile());
}
