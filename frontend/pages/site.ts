const PUBLIC_PAGES = ['site-terms-and-conditions'];

import { currentTeachersProfile, currentTeachersTasks } from 'backend/backend-api';
import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(async function () {
  enableProfileButtonClick($w);
  await Promise.all([
    askToFillInitialTeachersForm($w),
    updateHeaderProfileImage($w),
    updateHeaderNotificationsCount($w),
  ]);
  makeSureCannotAccessProtectedPages();
});

async function enableProfileButtonClick($w) {
  const effect = {
    duration: 200,
    delay: 0,
    direction: 'top',
  };

  $w('#profileIcons').onClick(() => {
    if ($w('#profileDropdown').hidden) {
      $w('#profileDropdown').show('slide', effect);
    } else {
      $w('#profileDropdown').hide('slide', effect);
    }
  });
  $w('#profileDropdown').onMouseOut(() => {
    $w('#profileDropdown').hide('slide', effect);
  });

  $w('#headerButtonLogout').onClick(() => {
    wixUsers.logout();
    $w('#profileDropdown').hide('slide', effect);
  });
  $w('#headerButtonDashboard').onClick(() => {
    wixLocation.to('/dashboard');
    $w('#profileDropdown').hide('slide', effect);
  });
}

async function askToFillInitialTeachersForm($w) {
  if (!isLiveSite()) return;
  const tasks = await currentTeachersTasks();
  const fillInitialTeachersFormTask = tasks[0];
  if (fillInitialTeachersFormTask && !fillInitialTeachersFormTask.isCompleted) {
    wixLocation.to(fillInitialTeachersFormTask.link);
  }
}

function makeSureCannotAccessProtectedPages() {
  const currentUser = wixUsers.currentUser;
  if (!currentUser.loggedIn) {
    const path = wixLocation.path[0];
    if (path && !PUBLIC_PAGES.includes(path)) {
      console.error(`Not logged in user should not visit ${path}`);
      wixLocation.to(PUBLIC_PAGES[0]);
    }
  }
}

async function updateHeaderProfileImage($w) {
  $w('#headerProfileImage').alt = 'My Profile';
  $w('#headerProfileImage').tooltip = 'My Profile';

  const teachersProfile = await currentTeachersProfile();
  if (teachersProfile) {
    $w('#headerProfileImage').src = teachersProfile.profileImage;
  }
}

async function updateHeaderNotificationsCount($w) {
  const tasks = await currentTeachersTasks();
  const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
  if (incompleteTasksCount) {
    $w('#headerNotificationsButton').label = String(incompleteTasksCount);
    $w('#headerNotificationsButton').show();
  }
}
