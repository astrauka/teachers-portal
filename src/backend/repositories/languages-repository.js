import { findByIdOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const LANGUAGES_COLLECTION = 'Languages';
export class LanguagesRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchLanguageByIdOrThrow(id) {
        return withLogger(`fetchLanguageByIdOrThrow ${id}`, findByIdOrThrow(this.externals, LANGUAGES_COLLECTION, id));
    }
}
