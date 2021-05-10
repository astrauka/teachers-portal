import { Externals } from '../context/production-context';
import { Module } from '../universal/entities/teacher-module';
import { findByIdOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const MODULES_COLLECTION = 'Modules';

export class ModulesRepository {
  constructor(private readonly externals: Externals) {}

  public fetchModuleByIdOrThrow(id: string): Promise<Module> {
    return withLogger(
      `fetchModuleByIdOrThrow ${id}`,
      findByIdOrThrow(this.externals, MODULES_COLLECTION, id)
    );
  }
}
