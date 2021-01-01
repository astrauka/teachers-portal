import { Teacher } from '../common/entities/teacher';
import { validateTask } from './business-logic/validate';
import { Task } from './common/entities/task';
import { EXTERNALS } from './context/production-context';
import { setupContext } from './context/setup-context';
import { withLogger } from './utils/logger';

export async function TeachersProfile_beforeInsert(teacher: Teacher) {
  const { actions, hooks } = await setupContext(EXTERNALS);
  return withLogger<Teacher>(`Hook TeachersProfile_beforeInsert ${teacher.email}`, async () =>
    hooks.registerTeacher(await actions.normalizeTeacher(teacher))
  );
}

export async function TeachersProfile_beforeUpdate(teacher: Teacher) {
  const { actions, hooks } = await setupContext(EXTERNALS);
  return withLogger<Teacher>(`Hook TeachersProfile_beforeUpdate ${teacher.email}`, async () =>
    hooks.registerTeacher(await actions.normalizeTeacher(teacher))
  );
}

export function Tasks_beforeInsert(task: Task) {
  return withLogger<Task>(`Hook Tasks_beforeInsert ${task.number}`, () => validateTask(task));
}

export function Tasks_beforeUpdate(task: Task) {
  return withLogger<Task>(`Hook Tasks_beforeUpdate ${task.number}`, () => validateTask(task));
}
