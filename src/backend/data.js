import { validateTask, validateTeachersInfo, validateTeachersProfile, } from './business-logic/validators';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { withLogger } from './utils/logger';
export async function TeachersInfo_afterInsert(teachersInfo) {
    const { hooks: { addTeacherToUsers }, } = await setupContext(EXTERNALS);
    await withLogger(`Hook TeachersInfo_afterInsert ${teachersInfo.email}`, addTeacherToUsers(teachersInfo));
    return teachersInfo;
}
export async function TeachersInfo_afterUpdate(teachersInfo, context) {
    const { hooks: { syncTeachersProfileData }, } = await setupContext(EXTERNALS);
    await withLogger(`Hook TeachersInfo_afterUpdate ${teachersInfo.email}`, syncTeachersProfileData(teachersInfo, context));
    return teachersInfo;
}
export function TeachersInfo_beforeInsert(teachersInfo) {
    return withLogger(`Hook TeachersInfo_beforeInsert ${teachersInfo.email}`, () => validateTeachersInfo(teachersInfo));
}
export function TeachersInfo_beforeUpdate(teachersInfo) {
    return withLogger(`Hook TeachersInfo_beforeUpdate ${teachersInfo.email}`, () => validateTeachersInfo(teachersInfo));
}
export async function TeachersProfile_beforeInsert(teachersProfile) {
    const { actions: { updateTeachersProfileSlug }, } = await setupContext(EXTERNALS);
    return withLogger(`Hook TeachersProfile_beforeInsert ${teachersProfile.email}`, () => updateTeachersProfileSlug(validateTeachersProfile(teachersProfile)));
}
export async function TeachersProfile_beforeUpdate(teachersProfile) {
    const { actions: { updateTeachersProfileSlug }, } = await setupContext(EXTERNALS);
    return withLogger(`Hook TeachersProfile_beforeUpdate ${teachersProfile.email}`, () => updateTeachersProfileSlug(validateTeachersProfile(teachersProfile)));
}
export function Tasks_beforeInsert(task) {
    return withLogger(`Hook Tasks_beforeInsert ${task.number}`, () => validateTask(task));
}
export function Tasks_beforeUpdate(task) {
    return withLogger(`Hook Tasks_beforeUpdate ${task.number}`, () => validateTask(task));
}
