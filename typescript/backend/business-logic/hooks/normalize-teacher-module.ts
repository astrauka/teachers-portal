import { TeacherModule } from '../../../common/entities/teacher-module';
import { ModulesRepository } from '../../repositories/modules-repository';

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
