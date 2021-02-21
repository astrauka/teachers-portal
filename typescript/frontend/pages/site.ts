import { Tasks, TeacherView } from 'public/common/entities/teacher';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import { getExistingElement } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { getElementWhenExists } from '../public/wix-utils';

forCurrentTeacher(async ({ teacher }: InitialState) => {
  onLogoutButtonClick();
  onContactMentorClick(teacher);
  updateHeaderNotificationsCount(teacher);
  setProfileImage(teacher);
  showProfileDropdown();
}, false);

function updateHeaderNotificationsCount(teacher: TeacherView) {
  const $headerNotificationsButton = getElementWhenExists(
    $w('#headerNotificationsButton' as 'Button')
  );
  if ($headerNotificationsButton) {
    const incompleteTasksCount = Tasks.length - teacher.completedTasks.length;
    if (incompleteTasksCount) {
      $headerNotificationsButton.label = String(incompleteTasksCount);
      $headerNotificationsButton.show();
    } else {
      $headerNotificationsButton.hide();
    }
  }
}

function setProfileImage(teacher: TeacherView) {
  const { profileImage, fullName, slug } = teacher;
  if (profileImage) {
    const $image = getExistingElement(
      $w('#profileIcon' as 'Image'),
      $w('#profileIconMobile' as 'Image')
    );
    $image.src = profileImage;
    $image.alt = fullName;
    $image.tooltip = fullName;
    $image.onClick(() => {
      wixLocation.to(`/teacher/${slug}`);
    });
  }
}

function showProfileDropdown() {
  const $profileImage = getElementWhenExists($w('#profileIcon' as 'Image'));
  if ($profileImage) {
    const $profileDropdown = $w('#profileDropdown' as 'Container');
    const $hoverArea = $w('#hoverArea' as 'Box');
    $profileImage.onMouseIn(() => {
      $profileDropdown.expand();
    });
    $hoverArea.onMouseOut(() => {
      $profileDropdown.collapse();
    });
  }
}

function onLogoutButtonClick() {
  getExistingElement(
    $w('#logoutButton' as 'Button'),
    $w('#logoutButtonMobile' as 'Button')
  ).onClick(() => {
    wixUsers.logout();
    wixLocation.to('/');
  });
}

function onContactMentorClick(teacher: TeacherView) {
  const $contactMentorButton = getExistingElement(
    $w('#contactMentorButton' as 'Button'),
    $w('#contactMentorButtonMobile' as 'Button')
  );
  if (teacher.mentorId) {
    $contactMentorButton.onClick(async () => {
      const curatingTeacher = await getCuratingTeacher();
      wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
    });
  } else {
    $contactMentorButton.collapse();
  }
}
