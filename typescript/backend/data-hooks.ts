import {
  validateTask,
  validateTeachersInfo,
  validateTeachersProfile,
} from './business-logic/validators';
import { Task } from './common/entities/task';
import { TeachersInfo } from './common/entities/teachers-info';
import { TeachersProfile } from './common/entities/teachers-profile';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { WixHookContext } from './types/wix-types';
import { withLogger } from './utils/logger';

export async function TeachersInfo_afterInsert(teachersInfo: TeachersInfo): Promise<TeachersInfo> {
  const {
    hooks: { addTeacherToUsers },
  } = await setupContext(EXTERNALS);
  await withLogger(
    `Hook TeachersInfo_afterInsert ${teachersInfo.email}`,
    addTeacherToUsers(teachersInfo)
  );
  return teachersInfo;
}

export async function TeachersInfo_afterUpdate(
  teachersInfo: TeachersInfo,
  context: WixHookContext<TeachersInfo>
): Promise<TeachersInfo> {
  const {
    hooks: { syncTeachersProfileData },
  } = await setupContext(EXTERNALS);

  await withLogger(
    `Hook TeachersInfo_afterUpdate ${teachersInfo.email}`,
    syncTeachersProfileData(teachersInfo, context)
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

export async function TeachersProfile_beforeInsert(teachersProfile: TeachersProfile) {
  const {
    actions: { updateTeachersProfileSlug },
  } = await setupContext(EXTERNALS);
  return withLogger<TeachersProfile>(
    `Hook TeachersProfile_beforeInsert ${teachersProfile.email}`,
    () => updateTeachersProfileSlug(validateTeachersProfile(teachersProfile))
  );
}

export async function TeachersProfile_beforeUpdate(teachersProfile: TeachersProfile) {
  const {
    actions: { updateTeachersProfileSlug },
  } = await setupContext(EXTERNALS);
  return withLogger<TeachersProfile>(
    `Hook TeachersProfile_beforeUpdate ${teachersProfile.email}`,
    () => updateTeachersProfileSlug(validateTeachersProfile(teachersProfile))
  );
}

export function Tasks_beforeInsert(task: Task) {
  return withLogger<Task>(`Hook Tasks_beforeInsert ${task.number}`, () => validateTask(task));
}

export function Tasks_beforeUpdate(task: Task) {
  return withLogger<Task>(`Hook Tasks_beforeUpdate ${task.number}`, () => validateTask(task));
}
