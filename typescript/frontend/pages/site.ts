import { currentTeachersProfile, currentTeachersTasks } from 'backend/backend-api';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { $W } from '../wix-types';

const PUBLIC_PAGES = ['site-terms-and-conditions'];

$w.onReady(() => {
  redirectNonLoggedInUserToPublicPage();
  return forLoggedInUser(async () => {
    enableProfileButtonClick($w);
    await Promise.all([
      askToFillInitialTeachersForm(),
      updateHeaderProfileImage($w),
      updateHeaderNotificationsCount($w),
    ]);
  });
});

function enableProfileButtonClick($w: $W) {
  const $profileDropdown = $w('#profileDropdown' as 'Container');
  const effect = {
    duration: 200,
    delay: 0,
    direction: 'top',
  };

  $w('#profileIcons' as 'Image').onClick(() => {
    if ($profileDropdown.hidden) {
      $profileDropdown.show('slide', effect);
    } else {
      $profileDropdown.hide('slide', effect);
    }
  });

  $profileDropdown.onMouseOut(() => {
    $profileDropdown.hide('slide', effect);
  });

  $w('#headerButtonLogout' as 'Button').onClick(() => {
    wixUsers.logout();
    $profileDropdown.hide('slide', effect);
  });

  $w('#headerButtonDashboard' as 'Button').onClick(() => {
    wixLocation.to('/dashboard');
    $profileDropdown.hide('slide', effect);
  });
}

async function askToFillInitialTeachersForm() {
  if (!isLiveSite()) return;
  const tasks = await currentTeachersTasks();
  const fillInitialTeachersFormTask = tasks[0];
  if (fillInitialTeachersFormTask && !fillInitialTeachersFormTask.isCompleted) {
    wixLocation.to(fillInitialTeachersFormTask.link);
  }
}

async function updateHeaderProfileImage($w: $W) {
  const $headerProfileImage = $w('#headerProfileImage' as 'Image');
  $headerProfileImage.alt = 'My Profile';
  $headerProfileImage.tooltip = 'My Profile';

  const teachersProfile = await currentTeachersProfile();
  if (teachersProfile) {
    $headerProfileImage.src = teachersProfile.profileImage;
  }
}

async function updateHeaderNotificationsCount($w: $W) {
  const $headerNotificationsButton = $w('#headerNotificationsButton' as 'Button');
  const tasks = await currentTeachersTasks();
  const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
  if (incompleteTasksCount) {
    $headerNotificationsButton.label = String(incompleteTasksCount);
    $headerNotificationsButton.show();
  }
}

function redirectNonLoggedInUserToPublicPage() {
  const currentUser = wixUsers.currentUser;
  if (!currentUser.loggedIn) {
    const path = wixLocation.path[0];
    if (path && !PUBLIC_PAGES.includes(path)) {
      console.error(`Not logged in user should not visit ${path}`);
      wixLocation.to(PUBLIC_PAGES[0]);
    }
  }
}
