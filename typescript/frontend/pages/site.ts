import { Tasks, TeacherView } from 'public/common/entities/teacher';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { getCuratingTeacher, getCurrentTeacher } from 'public/global-state';
import { executeOnce, getElementWhenExists, getExistingElement } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

forCurrentTeacher(
  'site',
  async ({ teacher }: InitialState) => {
    onLogoutButtonClick();
    onContactMentorClick();
    onProfileImageClick();
    showProfileDropdown();

    executeOnce($w('#siteLoadedStatus' as 'Text'), () => {
      showContactMentorButton(teacher);
      setProfileImage(teacher);
      updateHeaderNotificationsCount(teacher);
    });
  },
  false
);

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
  }
}

function onProfileImageClick() {
  const $image = getExistingElement(
    $w('#profileIcon' as 'Image'),
    $w('#profileIconMobile' as 'Image')
  );
  $image.onClick(async () => {
    const teacher = await getCurrentTeacher();
    wixLocation.to(`/teacher/${teacher.slug}`);
  });
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

function showContactMentorButton(teacher: TeacherView) {
  if (!teacher.mentorId) {
    const $contactMentorButton = getExistingElement(
      $w('#contactMentorButton' as 'Button'),
      $w('#contactMentorButtonMobile' as 'Button')
    );
    $contactMentorButton.collapse();
  }
}

function onContactMentorClick() {
  const $contactMentorButton = getExistingElement(
    $w('#contactMentorButton' as 'Button'),
    $w('#contactMentorButtonMobile' as 'Button')
  );
  $contactMentorButton.onClick(async () => {
    const curatingTeacher = await getCuratingTeacher();
    wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
  });
}
