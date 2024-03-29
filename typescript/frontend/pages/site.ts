import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { getCuratingTeacher, getCurrentTeacher } from 'public/global-state';
import { Tasks, TeacherView } from 'public/universal/entities/teacher';
import { executeOnce, forExistingElement, getExistingElement } from 'public/wix-utils';
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
  forExistingElement($w('#headerNotificationsButton' as 'Button'), ($headerNotificationsButton) => {
    const incompleteTasksCount = Tasks.length - teacher.completedTasks.length;
    if (incompleteTasksCount) {
      $headerNotificationsButton.label = String(incompleteTasksCount);
      $headerNotificationsButton.show();
    } else {
      $headerNotificationsButton.hide();
    }
  });
}

function setProfileImage(teacher: TeacherView) {
  forExistingElement($w('#profileIcon' as 'Image'), ($profileImage) => {
    const { profileImage, fullName } = teacher;
    if (profileImage) {
      $profileImage.src = profileImage;
      $profileImage.alt = fullName;
      $profileImage.tooltip = fullName;
    }
  });
}

function onProfileImageClick() {
  forExistingElement($w('#profileIcon' as 'Image'), ($profileIcon) => {
    $profileIcon.onClick(async () => {
      const teacher = await getCurrentTeacher();
      wixLocation.to(`/teacher/${teacher.slug}`);
    });
  });
}

function showProfileDropdown() {
  forExistingElement($w('#profileIcon' as 'Image'), ($profileIcon) => {
    const $profileDropdown = $w('#profileDropdown' as 'Container');
    const $hoverArea = $w('#hoverArea' as 'Box');
    $profileIcon.onMouseIn(() => {
      $profileDropdown.expand();
    });
    $hoverArea.onMouseOut(() => {
      $profileDropdown.collapse();
    });
  });
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
