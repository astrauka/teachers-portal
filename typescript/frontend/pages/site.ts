import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { updateHeaderNotificationsCount } from 'public/on-teacher-updated';
import { getFilter } from 'public/wix-filter';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

forCurrentTeacher(async ({ teacher }: InitialState) => {
  await $w('#CurrentTeacherDataset').setFilter(
    getFilter([[teacher.email, (filter) => filter.eq('email', teacher.email)]])
  );
  $w('#logoutButton' as 'Button').onClick(() => {
    wixUsers.logout();
    wixLocation.to('/welcome');
  });
  await updateHeaderNotificationsCount();
});
