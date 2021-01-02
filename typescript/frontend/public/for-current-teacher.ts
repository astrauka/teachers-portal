import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { TaskView } from './common/entities/task';
import { TeacherView } from './common/entities/teacher';
import { getCurrentTeacher, getTasks } from './global-state';

const PUBLIC_PAGES = ['welcome', 'error', 'privacy-policy', 'site-terms-and-conditions'];

export interface InitialState {
  teacher?: TeacherView;
  tasks?: TaskView[];
}

export function forCurrentTeacher(
  forCurrentTeacherFn: (initialState: InitialState) => Promise<void>
) {
  try {
    if (PUBLIC_PAGES.includes(wixLocation.path[0])) {
      return;
    }

    const currentUser = wixUsers.currentUser;
    if (!currentUser.loggedIn) {
      console.info('Current user is not logged in');
      return;
    }
  } catch (error) {
    console.error('Failed current user is logged in check', error);
    return;
  }

  $w.onReady(async () => {
    try {
      const [teacher, tasks] = await Promise.all([getTeacher(), getTasks()]);
      if (!teacher) {
        return wixLocation.to('/error');
      }
      await askToFillInitialTeachersForm(tasks);
      return await forCurrentTeacherFn({ teacher, tasks });
    } catch (error) {
      try {
        console.error(`Failed to execute site code for ${await getUserEmail()}`, error);
        if (isLiveSite()) {
          return wixLocation.to('/error');
        }
      } catch (error) {
        console.error('Failed to load the site', error);
      }
    }
  });
}

async function getUserEmail(): Promise<string | undefined> {
  try {
    return await wixUsers.currentUser.getEmail();
  } catch (error) {
    console.error(`Could not get current user email`, error);
  }
}

async function getTeacher(): Promise<TeacherView | undefined> {
  try {
    return await getCurrentTeacher();
  } catch (error) {
    console.error(`Current teacher not found for ${await getUserEmail()}`, error);
    wixUsers.logout();
  }
}

async function askToFillInitialTeachersForm(tasks: TaskView[]) {
  if (!isLiveSite() || 'initial-form' === wixLocation.path[0]) return;

  const fillInitialTeachersFormTask = tasks[0];
  if (fillInitialTeachersFormTask && !fillInitialTeachersFormTask.isCompleted) {
    console.info('Redirecting to initial profile form');
    wixLocation.to(fillInitialTeachersFormTask.link);
  }
}
