import { range } from 'lodash';
import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';
import { TaskName } from './common/entities/teacher';
import { isInitialStateLoaded, loadInitialState } from './global-state';
import { sleep } from './sleep';
const PUBLIC_PAGES = ['error', 'privacy-policy', 'site-terms-and-conditions'];
export function forCurrentTeacher(functionName, forCurrentTeacherFn, forPage = true) {
    if (wixWindow.rendering.env === 'browser' && isCurrentUserLoggedIn()) {
        $w.onReady(() => withErrorHandler('forCurrentTeacher', async () => {
            const { teacher } = await getInitialState(forPage);
            if (shouldFillInitialTeacherForm(teacher)) {
                if (forPage) {
                    return;
                }
                else {
                    return wixLocation.to('/initial-form');
                }
            }
            return await withErrorHandler(functionName, async () => await forCurrentTeacherFn({ teacher }));
        }));
    }
}
export async function withErrorHandler(name, executeFn) {
    try {
        return await executeFn();
    }
    catch (error) {
        console.error(`Failed in ${name} for ${await getUserEmail()} with ${error}`);
        $w('#headerMessage').expand();
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
function shouldFillInitialTeacherForm(teacher) {
    return (isLiveSite() &&
        'initial-form' !== wixLocation.path[0] &&
        !teacher.completedTasks.includes(TaskName.initialProfileForm));
}
function isPublicPage() {
    return PUBLIC_PAGES.includes(wixLocation.path[0]);
}
async function getInitialState(forPage) {
    try {
        if (forPage) {
            for (const _time of range(1, 50)) {
                if (!isInitialStateLoaded()) {
                    await sleep(100);
                }
                else {
                    break;
                }
            }
        }
        return await loadInitialState();
    }
    catch (error) {
        console.error(`Initial state failed to load ${await getUserEmail()}`, error);
        throw error;
    }
}
