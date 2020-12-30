import { fetchRecords, findSingleRecordOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const COUNTRIES_COLLECTION = 'Countries';
export class CountriesRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchCountriesByIds(ids) {
        return withLogger(`fetchCountriesByIds ${ids}`, fetchRecords(this.externals.wixData
            .query(COUNTRIES_COLLECTION)
            .hasSome('_id', ids)
            .find({ suppressAuth: true })));
    }
    fetchCountryByTitleOrThrow(title) {
        return withLogger(`fetchCountryByTitleOrThrow ${title}`, findSingleRecordOrThrow(this.externals.wixData
            .query(COUNTRIES_COLLECTION)
            .eq('title', title)
            .limit(1)
            .find({ suppressAuth: true })));
    }
}
