import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
forCurrentTeacher(async ({ teacher, tasks }) => {
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
function updateHeaderNotificationsCount(tasks) {
    const $headerNotificationsButton = $w('#headerNotificationsButton');
    if ($headerNotificationsButton.id) {
        const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
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
        const $image = $w('#profileIcon');
        $image.src = profileImage;
        $image.alt = fullName;
        $image.tooltip = fullName;
        $image.onClick(() => {
            wixLocation.to(`/teacher/${slug}`);
        });
    }
}
function showProfileDropdown() {
    const $profileImage = $w('#profileIcon');
    const $profileDropdown = $w('#profileDropdown');
    const $hoverArea = $w('#hoverArea');
    $profileImage.onMouseIn(() => {
        $profileDropdown.expand();
    });
    $hoverArea.onMouseOut(() => {
        $profileDropdown.collapse();
    });
}
function onLogoutButtonClick() {
    $w('#logoutButton').onClick(() => {
        wixUsers.logout();
        wixLocation.to('/');
    });
}
function onContactMentorClick(teacher) {
    const $contactMentorButton = $w('#contactMentorButton');
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
