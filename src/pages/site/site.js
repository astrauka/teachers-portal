import { forCurrentTeacher } from 'public/for-current-teacher';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
forCurrentTeacher(async ({ teacher, tasks }) => {
    $w('#logoutButton').onClick(() => {
        wixUsers.logout();
        wixLocation.to('/');
    });
    updateHeaderNotificationsCount(tasks);
    setProfileImage(teacher);
    showProfileDropdown();
}, false);
function updateHeaderNotificationsCount(tasks) {
    const $headerNotificationsButton = $w('#headerNotificationsButton');
    const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
    if (incompleteTasksCount) {
        $headerNotificationsButton.label = String(incompleteTasksCount);
        $headerNotificationsButton.show();
    }
    else {
        $headerNotificationsButton.hide();
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
    $profileImage.onMouseIn(() => {
        $profileDropdown.expand();
    });
    $profileDropdown.onMouseOut(() => {
        $profileDropdown.collapse();
    });
}
