import { Teacher } from '../common/entities/teacher';
import { context } from './context/setup-context';
import { withLogger } from './utils/logger';

export async function TeachersProfile_beforeInsert(teacher: Teacher) {
  const { actions, hooks } = context;
  return withLogger<Teacher>(`Hook TeachersProfile_beforeInsert ${teacher.email}`, async () =>
    hooks.registerTeacher(await actions.normalizeTeacher(teacher))
  );
}

export async function TeachersProfile_beforeUpdate(teacher: Teacher) {
  const { actions, hooks } = context;
  return withLogger<Teacher>(`Hook TeachersProfile_beforeUpdate ${teacher.email}`, async () =>
    hooks.registerTeacher(await actions.normalizeTeacher(teacher))
  );
}
