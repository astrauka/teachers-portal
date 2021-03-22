export function normalizeTeacherModuleFactory(modulesRepository) {
    return async function normalizeTeacherModule(teacherModule) {
        const module = await modulesRepository.fetchModuleByIdOrThrow(teacherModule.moduleId);
        return {
            ...teacherModule,
            module: module.title,
        };
    };
}
