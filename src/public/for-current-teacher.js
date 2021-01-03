import { isEmpty } from 'lodash';
import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { isInitialStateLoaded, loadInitialState } from './global-state';
import { sleep } from './sleep';
const PUBLIC_PAGES = ['welcome', 'error', 'privacy-policy', 'site-terms-and-conditions'];
export function forCurrentTeacher(forCurrentTeacherFn, forPage = true) {
    if (isCurrentUserLoggedIn()) {
        $w.onReady(async () => {
            try {
                const { teacher, tasks } = await getInitialState(forPage);
                if (!teacher || isEmpty(tasks)) {
                    return wixLocation.to('/error');
                }
                if (shouldFillInitialTeacherForm(tasks)) {
                    if (forPage) {
                        return;
                    }
                    else {
                        return wixLocation.to('/initial-form');
                    }
                }
                return await forCurrentTeacherFn({ teacher, tasks });
            }
            catch (error) {
                try {
                    console.error(`Failed to execute site code for ${await getUserEmail()}`, error);
                    if (isLiveSite()) {
                        return wixLocation.to('/error');
                    }
                }
                catch (error) {
                    console.error('Failed to load the site', error);
                }
            }
        });
    }
}
function isCurrentUserLoggedIn() {
    try {
        const currentUser = wixUsers.currentUser;
        if (currentUser.loggedIn) {
            return true;
        }
        if (!isPublicPage()) {
            console.info('Current user is not logged in');
        }
    }
    catch (error) {
        console.error('Failed current user is logged in check', error);
    }
}
async function getUserEmail() {
    try {
        return await wixUsers.currentUser.getEmail();
    }
    catch (error) {
        console.error(`Could not get current user email`, error);
    }
}
function shouldFillInitialTeacherForm(tasks) {
    return isLiveSite() && 'initial-form' !== wixLocation.path[0] && !tasks[0].isCompleted;
}
function isPublicPage() {
    return PUBLIC_PAGES.includes(wixLocation.path[0]);
}
async function getInitialState(forPage) {
    try {
        if (forPage) {
            while (!(await isInitialStateLoaded())) {
                await sleep(100);
            }
        }
        return loadInitialState();
    }
    catch (error) {
        console.error(`Initial state failed to laod ${await getUserEmail()}`, error);
        wixUsers.logout();
    }
}
