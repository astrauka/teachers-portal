import { validateTask } from './business-logic/validate';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { withLogger } from './utils/logger';
export async function TeachersProfile_beforeInsert(teacher) {
    const { actions } = await setupContext(EXTERNALS);
    return withLogger(`Hook TeachersProfile_beforeInsert ${teacher.email}`, () => actions.normalizeTeacher(teacher));
}
export async function TeachersProfile_beforeUpdate(teacher) {
    const { actions } = await setupContext(EXTERNALS);
    return withLogger(`Hook TeachersProfile_beforeUpdate ${teacher.email}`, () => actions.normalizeTeacher(teacher));
}
export async function TeachersProfile_afterInsert(teacher) {
    const { hooks } = await setupContext(EXTERNALS);
    await withLogger(`Hook TeachersProfile_afterInsert ${teacher.email}`, hooks.registerTeacher(teacher));
    return teacher;
}
export function Tasks_beforeInsert(task) {
    return withLogger(`Hook Tasks_beforeInsert ${task.number}`, () => validateTask(task));
}
export function Tasks_beforeUpdate(task) {
    return withLogger(`Hook Tasks_beforeUpdate ${task.number}`, () => validateTask(task));
}
