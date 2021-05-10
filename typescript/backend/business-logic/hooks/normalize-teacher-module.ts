import { ModulesRepository } from '../../repositories/modules-repository';
import { TeacherModule } from '../../universal/entities/teacher-module';

export type NormalizeTeacherModule = ReturnType<typeof normalizeTeacherModuleFactory>;

export function normalizeTeacherModuleFactory(modulesRepository: ModulesRepository) {
  return async function normalizeTeacherModule(
    teacherModule: TeacherModule
  ): Promise<TeacherModule> {
    const module = await modulesRepository.fetchModuleByIdOrThrow(teacherModule.moduleId);
    return {
      ...teacherModule,
      module: module.title,
    };
  };
}
