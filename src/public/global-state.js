import { getCuratingTeacherView, getCurrentTeachersTasks, getCurrentTeacherView, } from 'backend/backend-api';
import { memory } from 'wix-storage';
var GlobalState;
(function (GlobalState) {
    GlobalState["Teacher"] = "teacher";
    GlobalState["Tasks"] = "tasks";
    GlobalState["CuratingTeacher"] = "curatingTeacher";
    GlobalState["isInitialStateLoaded"] = "isInitialStateLoaded";
})(GlobalState || (GlobalState = {}));
async function fetchItem(item, fetchFn, refresh = false) {
    if (!refresh) {
        const persisted = memory.getItem(item);
        if (persisted) {
            return JSON.parse(persisted);
        }
    }
    const fetched = await fetchFn();
    memory.setItem(item, JSON.stringify(fetched));
    return fetched;
}
export async function getCurrentTeacher(refresh) {
    return fetchItem(GlobalState.Teacher, getCurrentTeacherView, refresh);
}
export async function getCuratingTeacher(refresh) {
    return fetchItem(GlobalState.CuratingTeacher, getCuratingTeacherView, refresh);
}
export async function getTasks(refresh) {
    return fetchItem(GlobalState.Tasks, getCurrentTeachersTasks, refresh);
}
export async function loadInitialState() {
    const [teacher, tasks] = await Promise.all([getCurrentTeacher(), getTasks()]);
    memory.setItem(GlobalState.isInitialStateLoaded, 'true');
    return { teacher, tasks };
}
export async function isInitialStateLoaded() {
    return Boolean(await memory.getItem(GlobalState.isInitialStateLoaded));
}
export async function refreshInitialState() {
    const [teacher, tasks] = await Promise.all([getCurrentTeacher(true), getTasks(true)]);
    return { teacher, tasks };
}
