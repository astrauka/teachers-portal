import { getAllAccountStatuses, getCuratingTeacherView, getCurrentTeacherView, } from 'backend/backend-api';
import { memory } from 'wix-storage';
var GlobalState;
(function (GlobalState) {
    GlobalState["Teacher"] = "Teacher";
    GlobalState["CuratingTeacher"] = "CuratingTeacher";
    GlobalState["AccountStatuses"] = "AccountStatuses";
    GlobalState["InitialStateLoaded"] = "InitialStateLoaded";
})(GlobalState || (GlobalState = {}));
async function fetchItem(item, fetchFn, refresh = false) {
    if (!refresh) {
        const persisted = memory.getItem(item);
        if (persisted) {
            return JSON.parse(persisted);
        }
    }
    try {
        const fetched = await fetchFn();
        if (fetched) {
            memory.setItem(item, JSON.stringify(fetched));
        }
        return fetched;
    }
    catch (error) {
        console.error(`Failed to fetch global state item ${item}, ${error}`);
        throw error;
    }
}
export async function getCurrentTeacher(refresh) {
    return fetchItem(GlobalState.Teacher, getCurrentTeacherView, refresh);
}
export async function getCuratingTeacher(refresh) {
    return fetchItem(GlobalState.CuratingTeacher, getCuratingTeacherView, refresh);
}
export async function getAccountStatuses() {
    return fetchItem(GlobalState.AccountStatuses, getAllAccountStatuses);
}
export async function loadInitialState() {
    const teacher = await getCurrentTeacher();
    memory.setItem(GlobalState.InitialStateLoaded, 'true');
    return { teacher };
}
export function InitialStateLoaded() {
    return Boolean(memory.getItem(GlobalState.InitialStateLoaded));
}
export async function refreshInitialState() {
    const teacher = await getCurrentTeacher(true);
    return { teacher };
}
