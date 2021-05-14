import { buildModule, buildTeacherModule } from '../../../test/builders/teacher-module';
import { expect } from '../../../test/utils/expectations';
import { stubType } from '../../../test/utils/stubbing';
import { ModulesRepository } from '../../repositories/modules-repository';
import { Module } from '../../universal/entities/teacher-module';

import { normalizeTeacherModuleFactory } from './normalize-teacher-module';

describe('normalizeTeacherModule', () => {
  const module = buildModule();
  const teacherModule = buildTeacherModule({
    properties: { moduleId: module._id },
    without: ['module'],
  });

  const getModulesRepository = (module: Module) =>
    stubType<ModulesRepository>((stub) => {
      stub.fetchModuleByIdOrThrow.resolves(module);
    });

  const buildTestContext = ({ modulesRepository = getModulesRepository(module) } = {}) => ({
    modulesRepository,
    normalizeTeacherModule: normalizeTeacherModuleFactory(modulesRepository),
  });

  it('should update teacher module with module name', async () => {
    const { modulesRepository, normalizeTeacherModule } = buildTestContext();
    expect(await normalizeTeacherModule(teacherModule)).to.eql({
      ...teacherModule,
      module: module.title,
    });
    expect(modulesRepository.fetchModuleByIdOrThrow).calledOnceWithExactly(module._id);
  });
});
