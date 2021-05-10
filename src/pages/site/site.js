import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher, getCurrentTeacher } from 'public/global-state';
import { Tasks } from 'public/universal/entities/teacher';
import { executeOnce, forExistingElement, getExistingElement } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
forCurrentTeacher('site', async ({ teacher }) => {
    onLogoutButtonClick();
    onContactMentorClick();
    onProfileImageClick();
    showProfileDropdown();
    executeOnce($w('#siteLoadedStatus'), () => {
        showContactMentorButton(teacher);
        setProfileImage(teacher);
        updateHeaderNotificationsCount(teacher);
    });
}, false);
function updateHeaderNotificationsCount(teacher) {
    forExistingElement($w('#headerNotificationsButton'), ($headerNotificationsButton) => {
        const incompleteTasksCount = Tasks.length - teacher.completedTasks.length;
        if (incompleteTasksCount) {
            $headerNotificationsButton.label = String(incompleteTasksCount);
            $headerNotificationsButton.show();
        }
        else {
            $headerNotificationsButton.hide();
        }
    });
}
function setProfileImage(teacher) {
    forExistingElement($w('#profileIcon'), ($profileImage) => {
        const { profileImage, fullName } = teacher;
        if (profileImage) {
            $profileImage.src = profileImage;
            $profileImage.alt = fullName;
            $profileImage.tooltip = fullName;
        }
    });
}
function onProfileImageClick() {
    forExistingElement($w('#profileIcon'), ($profileIcon) => {
        $profileIcon.onClick(async () => {
            const teacher = await getCurrentTeacher();
            wixLocation.to(`/teacher/${teacher.slug}`);
        });
    });
}
function showProfileDropdown() {
    forExistingElement($w('#profileIcon'), ($profileIcon) => {
        const $profileDropdown = $w('#profileDropdown');
        const $hoverArea = $w('#hoverArea');
        $profileIcon.onMouseIn(() => {
            $profileDropdown.expand();
        });
        $hoverArea.onMouseOut(() => {
            $profileDropdown.collapse();
        });
    });
}
function onLogoutButtonClick() {
    getExistingElement($w('#logoutButton'), $w('#logoutButtonMobile')).onClick(() => {
        wixUsers.logout();
        wixLocation.to('/');
    });
}
function showContactMentorButton(teacher) {
    if (!teacher.mentorId) {
        const $contactMentorButton = getExistingElement($w('#contactMentorButton'), $w('#contactMentorButtonMobile'));
        $contactMentorButton.collapse();
    }
}
function onContactMentorClick() {
    const $contactMentorButton = getExistingElement($w('#contactMentorButton'), $w('#contactMentorButtonMobile'));
    $contactMentorButton.onClick(async () => {
        const curatingTeacher = await getCuratingTeacher();
        wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
    });
}
