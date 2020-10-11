import { Externals } from '../context/production-context';
import { Country } from '../types/country';
import { fetchRecords, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const COUNTRIES_COLLECTION = 'Countries';

export class CountryRepository {
  constructor(private readonly externals: Externals) {}

  public fetchCountriesByIds(ids: string[]): Promise<Country[]> {
    return withLogger(
      `fetchCountriesByIds ${ids}`,
      fetchRecords<Country>(
        this.externals.wixData
          .query(COUNTRIES_COLLECTION)
          .eq('id', ids)
          .find({ suppressAuth: true })
      )
    );
  }

  public fetchCountryByTitle(title: string): Promise<Country> {
    return withLogger(
      `fetchCountryByTitle ${title}`,
      findSingleRecordSafe<Country>(
        this.externals.wixData
          .query(COUNTRIES_COLLECTION)
          .eq('title', title)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
