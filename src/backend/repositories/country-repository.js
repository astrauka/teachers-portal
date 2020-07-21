import { findById, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const COUNTRIES_COLLECTION = 'Countries';
export class CountryRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchCountryById(id) {
        return withLogger(`fetchCountryById ${id}`, findById(this.externals, COUNTRIES_COLLECTION, id));
    }
    fetchCountryByTitle(title) {
        return withLogger(`fetchCountryByTitle ${title}`, findSingleRecordSafe(this.externals.wixData
            .query(COUNTRIES_COLLECTION)
            .eq('title', title)
            .limit(1)
            .find({ suppressAuth: true })));
    }
}
