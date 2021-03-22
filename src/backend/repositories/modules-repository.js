import { findByIdOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const MODULES_COLLECTION = 'Modules';
export class ModulesRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchModuleByIdOrThrow(id) {
        return withLogger(`fetchModuleByIdOrThrow ${id}`, findByIdOrThrow(this.externals, MODULES_COLLECTION, id));
    }
}
