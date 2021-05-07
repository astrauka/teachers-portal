import { Teacher, TeacherView } from './common/entities/teacher';
import { TeacherModule } from './common/entities/teacher-module';
import { context } from './context/setup-context';
import { withLogger } from './utils/logger';

export async function TeachersProfile_beforeInsert(teacher: Teacher) {
  const { hooks } = context;
  return withLogger<Teacher>(`Hook TeachersProfile_beforeInsert ${teacher.email}`, async () =>
    hooks.registerTeacher(await hooks.normalizeTeacher(teacher, true))
  );
}

export async function TeachersProfile_beforeUpdate(teacher: Teacher) {
  const { hooks } = context;
  return withLogger<Teacher>(`Hook TeachersProfile_beforeUpdate ${teacher.email}`, async () =>
    hooks.registerTeacher(await hooks.normalizeTeacher(teacher, false))
  );
}

export async function TeachersProfile_afterGet(teacher: Teacher) {
  const { hooks } = context;
  return withLogger<TeacherView>(`Hook TeachersProfile_afterGet ${teacher.email}`, async () => {
    return hooks.makeTeacherView(teacher);
  });
}

export async function TeachersProfile_afterQuery(teacher: Teacher) {
  const { hooks } = context;
  return withLogger<TeacherView>(
    `Hook TeachersProfile_afterQuery ${teacher.email}`,
    hooks.makeTeacherView(teacher)
  );
}

export async function TeacherModules_beforeInsert(teacherModule: TeacherModule) {
  const { hooks } = context;
  return withLogger<TeacherModule>(
    `Hook TeacherModules_beforeInsert ${teacherModule.moduleId}`,
    hooks.normalizeTeacherModule(teacherModule)
  );
}

export async function TeacherModules_beforeUpdate(teacherModule: TeacherModule) {
  const { hooks } = context;
  return withLogger<TeacherModule>(
    `Hook TeacherModules_beforeUpdate ${teacherModule.moduleId}`,
    hooks.normalizeTeacherModule(teacherModule)
  );
}
