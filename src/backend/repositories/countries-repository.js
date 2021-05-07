import { findByIdOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';
const COUNTRIES_COLLECTION = 'Countries';
export class CountriesRepository {
    constructor(externals) {
        this.externals = externals;
    }
    fetchCountryByIdOrThrow(id) {
        return withLogger(`fetchCountryByIdOrThrow ${id}`, findByIdOrThrow(this.externals, COUNTRIES_COLLECTION, id));
    }
}
