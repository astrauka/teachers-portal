import { forCurrentTeacher } from 'public/for-current-teacher';
import { getTasks } from 'public/global-state';
import { updateHeaderNotificationsCount } from 'public/on-teacher-updated';
import { getFilter } from 'public/wix-filter';
import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
let state;
forCurrentTeacher(async (teacher) => {
    state = { teacher, tasks: await getTasks() };
    await $w('#CurrentTeacherDataset').setFilter(getFilter([[teacher.email, (filter) => filter.eq('email', teacher.email)]]));
    $w('#logoutButton').onClick(() => {
        wixUsers.logout();
        wixLocation.to('/welcome');
    });
    askToFillInitialTeachersForm();
    await updateHeaderNotificationsCount();
});
function askToFillInitialTeachersForm() {
    if (!isLiveSite() || 'initial-form' === wixLocation.path[0])
        return;
    const fillInitialTeachersFormTask = state.tasks[0];
    if (fillInitialTeachersFormTask && !fillInitialTeachersFormTask.isCompleted) {
        console.info('Redirecting to initial profile form');
        wixLocation.to(fillInitialTeachersFormTask.link);
    }
}
