import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { getCurrentTeacher } from './global-state';
const PUBLIC_PAGES = ['welcome', 'error', 'privacy-policy', 'site-terms-and-conditions'];
export function forCurrentTeacher(forCurrentTeacherFn) {
    $w.onReady(async () => {
        try {
            if (PUBLIC_PAGES.includes(wixLocation.path[0])) {
                return;
            }
            const currentUser = wixUsers.currentUser;
            if (!currentUser.loggedIn) {
                console.info('Current user is not logged in');
                return wixLocation.to('/welcome');
            }
            const teacher = await getTeacher();
            if (!teacher) {
                return wixLocation.to('/error');
            }
            try {
                return await forCurrentTeacherFn(teacher);
            }
            catch (error) {
                console.error(`Failed to execute site code for ${teacher.email}`, error);
                if (isLiveSite()) {
                    return wixLocation.to('/error');
                }
            }
        }
        catch (error) {
            console.error('Failed to load the site', error);
        }
    });
}
async function getUserEmail() {
    try {
        return await wixUsers.currentUser.getEmail();
    }
    catch (error) {
        console.error(`Could not get current user email`, error);
    }
}
async function getTeacher() {
    try {
        return await getCurrentTeacher();
    }
    catch (error) {
        console.error(`Current teacher not found for ${await getUserEmail()}`, error);
        wixUsers.logout();
    }
}
