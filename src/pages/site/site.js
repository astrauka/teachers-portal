import { Tasks } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import { getElementWhenExists, getExistingElement } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
forCurrentTeacher('site', async ({ teacher }) => {
    onLogoutButtonClick();
    onContactMentorClick(teacher);
    updateHeaderNotificationsCount(teacher);
    setProfileImage(teacher);
    showProfileDropdown();
}, false);
function updateHeaderNotificationsCount(teacher) {
    const $headerNotificationsButton = getElementWhenExists($w('#headerNotificationsButton'));
    if ($headerNotificationsButton) {
        const incompleteTasksCount = Tasks.length - teacher.completedTasks.length;
        if (incompleteTasksCount) {
            $headerNotificationsButton.label = String(incompleteTasksCount);
            $headerNotificationsButton.show();
        }
        else {
            $headerNotificationsButton.hide();
        }
    }
}
function setProfileImage(teacher) {
    const { profileImage, fullName, slug } = teacher;
    if (profileImage) {
        const $image = getExistingElement($w('#profileIcon'), $w('#profileIconMobile'));
        $image.src = profileImage;
        $image.alt = fullName;
        $image.tooltip = fullName;
        $image.onClick(() => {
            wixLocation.to(`/teacher/${slug}`);
        });
    }
}
function showProfileDropdown() {
    const $profileImage = getElementWhenExists($w('#profileIcon'));
    if ($profileImage) {
        const $profileDropdown = $w('#profileDropdown');
        const $hoverArea = $w('#hoverArea');
        $profileImage.onMouseIn(() => {
            $profileDropdown.expand();
        });
        $hoverArea.onMouseOut(() => {
            $profileDropdown.collapse();
        });
    }
}
function onLogoutButtonClick() {
    getExistingElement($w('#logoutButton'), $w('#logoutButtonMobile')).onClick(() => {
        wixUsers.logout();
        wixLocation.to('/');
    });
}
function onContactMentorClick(teacher) {
    const $contactMentorButton = getExistingElement($w('#contactMentorButton'), $w('#contactMentorButtonMobile'));
    if (teacher.mentorId) {
        $contactMentorButton.onClick(async () => {
            const curatingTeacher = await getCuratingTeacher();
            wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
        });
    }
    else {
        $contactMentorButton.collapse();
    }
}
