import { TaskView } from 'public/common/entities/task';
import { TeacherView } from 'public/common/entities/teacher';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

forCurrentTeacher(async ({ teacher, tasks }: InitialState) => {
  $w('#logoutButton' as 'Button').onClick(() => {
    wixUsers.logout();
    wixLocation.to('/welcome');
  });
  updateHeaderNotificationsCount(tasks);
  setProfileImage(teacher);
}, false);

function updateHeaderNotificationsCount(tasks: TaskView[]) {
  const $headerNotificationsButton = $w('#headerNotificationsButton' as 'Button');
  const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
  if (incompleteTasksCount) {
    $headerNotificationsButton.label = String(incompleteTasksCount);
    $headerNotificationsButton.show();
  } else {
    $headerNotificationsButton.hide();
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
