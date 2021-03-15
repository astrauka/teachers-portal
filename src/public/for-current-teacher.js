import { range } from 'lodash';
import { isLiveSite } from 'public/wix-utils';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';
import { TaskName } from './common/entities/teacher';
import { isInitialStateLoaded, loadInitialState } from './global-state';
import { sleep } from './sleep';
export function forCurrentTeacher(functionName, forCurrentTeacherFn, forPage = true) {
    $w.onReady(() => {
        if (wixWindow.rendering.env === 'browser' && wixUsers.currentUser.loggedIn) {
            return withErrorHandler('forCurrentTeacher', async () => {
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
            });
        }
    });
}
export async function withErrorHandler(name, executeFn) {
    try {
        return await executeFn();
    }
    catch (error) {
        console.error(`Failed in ${name} for ${await getUserEmail()} with ${error}`);
        const $errorMessage = $w('#headerMessage');
        $errorMessage.show();
        setTimeout(() => $errorMessage.hide('fade'), 5000);
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
