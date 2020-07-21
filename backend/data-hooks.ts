import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { Task, validateTask } from './types/task';
import { TeachersInfo, validateTeachersInfo } from './types/teachers-info';
import { TeachersProfile, validateTeachersProfile } from './types/teachers-profile';
import { withLogger } from './utils/logger';

export async function TeachersInfo_afterInsert(teachersInfo: TeachersInfo): Promise<TeachersInfo> {
  const {
    actions: { addTeacherToUsers },
  } = await setupContext(EXTERNALS);
  await withLogger(
    `Hook TeachersInfo_afterInsert ${teachersInfo.email}`,
    addTeacherToUsers(teachersInfo)
  );
  return teachersInfo;
}

export async function TeachersInfo_afterUpdate(teachersInfo: TeachersInfo): Promise<TeachersInfo> {
  const {
    actions: { addTeacherToUsers },
  } = await setupContext(EXTERNALS);
  await withLogger(
    `Hook TeachersInfo_afterUpdate ${teachersInfo.email}`,
    addTeacherToUsers(teachersInfo)
  );

  return teachersInfo;
}

export function TeachersInfo_beforeInsert(teachersInfo: TeachersInfo): Promise<TeachersInfo> {
  return withLogger<TeachersInfo>(`Hook TeachersInfo_beforeInsert ${teachersInfo.email}`, () =>
    validateTeachersInfo(teachersInfo)
  );
}

export function TeachersInfo_beforeUpdate(teachersInfo: TeachersInfo): Promise<TeachersInfo> {
  return withLogger<TeachersInfo>(`Hook TeachersInfo_beforeUpdate ${teachersInfo.email}`, () =>
    validateTeachersInfo(teachersInfo)
  );
}

export function TeachersProfile_beforeInsert(teachersProfile: TeachersProfile) {
  return withLogger<TeachersProfile>(
    `Hook TeachersProfile_beforeInsert ${teachersProfile.email}`,
    () => validateTeachersProfile(teachersProfile)
  );
}

export function TeachersProfile_beforeUpdate(teachersProfile: TeachersProfile) {
  return withLogger<TeachersProfile>(
    `Hook TeachersProfile_beforeUpdate ${teachersProfile.email}`,
    () => validateTeachersProfile(teachersProfile)
  );
}

export function Tasks_beforeInsert(task: Task) {
  return withLogger<Task>(`Hook Tasks_beforeInsert ${task.number}`, () => validateTask(task));
}

export function Tasks_beforeUpdate(task: Task) {
  return withLogger<Task>(`Hook Tasks_beforeUpdate ${task.number}`, () => validateTask(task));
}
