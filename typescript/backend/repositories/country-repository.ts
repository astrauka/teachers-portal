import { Country } from '../common/entities/country';
import { Externals } from '../context/production-context';
import { fetchRecords, findSingleRecordOrThrow } from '../utils/database-queries';
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
          .hasSome('_id', ids)
          .find({ suppressAuth: true })
      )
    );
  }

  public fetchCountryByTitleOrThrow(title: string): Promise<Country> {
    return withLogger(
      `fetchCountryByTitleOrThrow ${title}`,
      findSingleRecordOrThrow<Country>(
        this.externals.wixData
          .query(COUNTRIES_COLLECTION)
          .eq('title', title)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
