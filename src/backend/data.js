import { context } from './context/setup-context';
import { withLogger } from './utils/logger';
export async function TeachersProfile_beforeInsert(teacher) {
    const { hooks } = context;
    return withLogger(`Hook TeachersProfile_beforeInsert ${teacher.email}`, async () => hooks.registerTeacher(await hooks.normalizeTeacher(teacher, true)));
}
export async function TeachersProfile_beforeUpdate(teacher) {
    const { hooks } = context;
    return withLogger(`Hook TeachersProfile_beforeUpdate ${teacher.email}`, async () => hooks.registerTeacher(await hooks.normalizeTeacher(teacher, false)));
}
export async function TeacherModules_beforeInsert(teacherModule) {
    const { hooks } = context;
    return withLogger(`Hook TeacherModules_beforeInsert ${teacherModule.moduleId}`, hooks.normalizeTeacherModule(teacherModule));
}
export async function TeacherModules_beforeUpdate(teacherModule) {
    const { hooks } = context;
    return withLogger(`Hook TeacherModules_beforeUpdate ${teacherModule.moduleId}`, hooks.normalizeTeacherModule(teacherModule));
}
