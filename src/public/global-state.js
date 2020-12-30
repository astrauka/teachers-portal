import { getCuratingTeacherView, getCurrentTeachersTasks, getCurrentTeacherView, } from 'backend/backend-api';
import { memoize } from 'lodash';
const state = {};
export async function getCurrentTeacher() {
    if (state.teacher) {
        return state.teacher;
    }
    return fetchCurrentTeacher();
}
export function setCurrentTeacher(teacher) {
    state.teacher = teacher;
}
const fetchCurrentTeacher = memoize(async () => {
    const teacher = await getCurrentTeacherView();
    state.teacher = teacher;
    return teacher;
});
export async function getTasks() {
    if (state.tasks) {
        return state.tasks;
    }
    return fetchTasks();
}
export async function refreshTasks() {
    state.tasks = await getCurrentTeachersTasks();
}
const fetchTasks = memoize(async () => {
    const tasks = await getCurrentTeachersTasks();
    state.tasks = tasks;
    return tasks;
});
export async function getCuratingTeacher() {
    if (state.curatingTeacher) {
        return state.curatingTeacher;
    }
    return fetchCuratingTeacher();
}
const fetchCuratingTeacher = memoize(async () => {
    const curatingTeacher = await getCuratingTeacherView();
    state.curatingTeacher = curatingTeacher;
    return curatingTeacher;
});
