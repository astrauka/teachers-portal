import { findById, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const LANGUAGES_COLLECTION = 'Languages';
export class LanguageRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchLanguageById(id) {
        return withLogger(`fetchLanguageById ${id}`, findById(this.externals, LANGUAGES_COLLECTION, id));
    }
    fetchLanguageByTitle(title) {
        return withLogger(`fetchLanguageByTitle ${title}`, findSingleRecordSafe(this.externals.wixData
            .query(LANGUAGES_COLLECTION)
            .eq('title', title)
            .limit(1)
            .find({ suppressAuth: true })));
    }
}
