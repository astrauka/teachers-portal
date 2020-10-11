import { fetchRecords, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const LANGUAGES_COLLECTION = 'Languages';
export class LanguageRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchLanguagesByIds(ids) {
        return withLogger(`fetchLanguagesByIds ${ids}`, fetchRecords(this.externals.wixData
            .query(LANGUAGES_COLLECTION)
            .hasSome('_id', ids)
            .find({ suppressAuth: true })));
    }
    fetchLanguageByTitle(title) {
        return withLogger(`fetchLanguageByTitle ${title}`, findSingleRecordSafe(this.externals.wixData
            .query(LANGUAGES_COLLECTION)
            .eq('title', title)
            .limit(1)
            .find({ suppressAuth: true })));
    }
}
