import { Tasks, TeacherView } from 'public/common/entities/teacher';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

forCurrentTeacher(async ({ teacher }: InitialState) => {
  onLogoutButtonClick();
  onContactMentorClick(teacher);
  updateHeaderNotificationsCount(teacher);
  setProfileImage(teacher);
  showProfileDropdown();
}, false);

function updateHeaderNotificationsCount(teacher: TeacherView) {
  const $headerNotificationsButton = $w('#headerNotificationsButton' as 'Button');
  if ($headerNotificationsButton.id) {
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
    const $image = $w('#profileIcon' as 'Image');
    $image.src = profileImage;
    $image.alt = fullName;
    $image.tooltip = fullName;
    $image.onClick(() => {
      wixLocation.to(`/teacher/${slug}`);
    });
  }
}

function showProfileDropdown() {
  const $profileImage = $w('#profileIcon' as 'Image');
  const $profileDropdown = $w('#profileDropdown' as 'Container');
  const $hoverArea = $w('#hoverArea' as 'Box');
  $profileImage.onMouseIn(() => {
    $profileDropdown.expand();
  });
  $hoverArea.onMouseOut(() => {
    $profileDropdown.collapse();
  });
}

function onLogoutButtonClick() {
  $w('#logoutButton' as 'Button').onClick(() => {
    wixUsers.logout();
    wixLocation.to('/');
  });
}

function onContactMentorClick(teacher: TeacherView) {
  const $contactMentorButton = $w('#contactMentorButton' as 'Button');
  if (teacher.mentorId) {
    $contactMentorButton.onClick(async () => {
      const curatingTeacher = await getCuratingTeacher();
      wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
    });
  } else {
    $contactMentorButton.collapse();
  }
}
