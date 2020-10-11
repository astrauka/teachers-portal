import { fetchRecords, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const COUNTRIES_COLLECTION = 'Countries';
export class CountryRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchCountriesByIds(ids) {
        return withLogger(`fetchCountriesByIds ${ids}`, fetchRecords(this.externals.wixData
            .query(COUNTRIES_COLLECTION)
            .eq('id', ids)
            .find({ suppressAuth: true })));
    }
    fetchCountryByTitle(title) {
        return withLogger(`fetchCountryByTitle ${title}`, findSingleRecordSafe(this.externals.wixData
            .query(COUNTRIES_COLLECTION)
            .eq('title', title)
            .limit(1)
            .find({ suppressAuth: true })));
    }
}
