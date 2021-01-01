import { validateTask } from './business-logic/validate';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { withLogger } from './utils/logger';
export async function TeachersProfile_beforeInsert(teacher) {
    const { actions, hooks } = await setupContext(EXTERNALS);
    return withLogger(`Hook TeachersProfile_beforeInsert ${teacher.email}`, async () => hooks.registerTeacher(await actions.normalizeTeacher(teacher)));
}
export async function TeachersProfile_beforeUpdate(teacher) {
    const { actions, hooks } = await setupContext(EXTERNALS);
    return withLogger(`Hook TeachersProfile_beforeUpdate ${teacher.email}`, async () => hooks.registerTeacher(await actions.normalizeTeacher(teacher)));
}
export function Tasks_beforeInsert(task) {
    return withLogger(`Hook Tasks_beforeInsert ${task.number}`, () => validateTask(task));
}
export function Tasks_beforeUpdate(task) {
    return withLogger(`Hook Tasks_beforeUpdate ${task.number}`, () => validateTask(task));
}
