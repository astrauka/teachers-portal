import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { TaskName, TeacherView } from './common/entities/teacher';
import { isInitialStateLoaded, loadInitialState } from './global-state';
import { sleep } from './sleep';

const PUBLIC_PAGES = ['error', 'privacy-policy', 'site-terms-and-conditions'];

export interface InitialState {
  teacher: TeacherView;
}

export function forCurrentTeacher(
  forCurrentTeacherFn: (initialState: InitialState) => Promise<void>,
  forPage = true
) {
  if (isCurrentUserLoggedIn()) {
    $w.onReady(async () => {
      try {
        const { teacher } = await getInitialState(forPage);
        if (shouldFillInitialTeacherForm(teacher)) {
          if (forPage) {
            return;
          } else {
            return wixLocation.to('/initial-form');
          }
        }
        return await forCurrentTeacherFn({ teacher });
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
}

function isCurrentUserLoggedIn(): boolean {
  try {
    const currentUser = wixUsers.currentUser;
    if (currentUser.loggedIn) {
      return true;
    }
    if (!isPublicPage()) {
      console.info('Current user is not logged in');
    }
  } catch (error) {
    console.error('Failed current user is logged in check', error);
  }
}

async function getUserEmail(): Promise<string | undefined> {
  try {
    return await wixUsers.currentUser.getEmail();
  } catch (error) {
    console.error(`Could not get current user email`, error);
  }
}

function shouldFillInitialTeacherForm(teacher: TeacherView) {
  return (
    isLiveSite() &&
    'initial-form' !== wixLocation.path[0] &&
    !teacher.completedTasks.includes(TaskName.initialProfileForm)
  );
}

function isPublicPage(): boolean {
  return PUBLIC_PAGES.includes(wixLocation.path[0]);
}

async function getInitialState(forPage: boolean): Promise<InitialState> {
  try {
    if (forPage) {
      while (!isInitialStateLoaded()) {
        await sleep(100);
      }
    }
    return await loadInitialState();
  } catch (error) {
    console.error(`Initial state failed to load ${await getUserEmail()}`, error);
    throw error;
  }
}
