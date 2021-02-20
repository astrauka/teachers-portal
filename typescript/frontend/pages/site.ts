import { TaskView } from 'public/common/entities/task';
import { TeacherView } from 'public/common/entities/teacher';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

forCurrentTeacher(async ({ teacher, tasks }: InitialState) => {
  console.info(1);
  onLogoutButtonClick();
  console.info(2);
  onContactMentorClick(teacher);
  console.info(3);
  updateHeaderNotificationsCount(tasks);
  console.info(4);
  setProfileImage(teacher);
  console.info(5);
  showProfileDropdown();
  console.info(6);
}, false);

function updateHeaderNotificationsCount(tasks: TaskView[]) {
  const $headerNotificationsButton = $w('#headerNotificationsButton' as 'Button');
  if ($headerNotificationsButton.id) {
    const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
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
