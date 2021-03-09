import { context } from './context/setup-context';
import { withLogger } from './utils/logger';
export async function Teachers_beforeInsert(teacher) {
    const { actions, hooks } = context;
    return withLogger(`Hook Teachers_beforeInsert ${teacher.email}`, async () => hooks.registerTeacher(await actions.normalizeTeacher(teacher, true)));
}
export async function Teachers_beforeUpdate(teacher) {
    const { actions, hooks } = context;
    return withLogger(`Hook Teachers_beforeUpdate ${teacher.email}`, async () => hooks.registerTeacher(await actions.normalizeTeacher(teacher, false)));
}
