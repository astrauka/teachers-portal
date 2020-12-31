import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { Teacher, TeacherView } from './common/entities/teacher';
import { getCurrentTeacher } from './global-state';

export function forCurrentTeacher(forCurrentTeacherFn: (teacher: Teacher) => Promise<void>) {
  $w.onReady(async () => {
    try {
      const currentUser = wixUsers.currentUser;
      if (!currentUser.loggedIn) {
        console.error('Current user is not logged in');
        return wixLocation.to('/welcome');
      }

      const teacher = await getTeacher();
      if (!teacher) {
        return wixLocation.to('/error');
      }

      try {
        return await forCurrentTeacherFn(teacher);
      } catch (error) {
        console.error(`Failed to execute site code for ${teacher.email}`, error);
        if (isLiveSite()) {
          return wixLocation.to('/error');
        }
      }
    } catch (error) {
      console.error('Failed to load the site', error);
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
