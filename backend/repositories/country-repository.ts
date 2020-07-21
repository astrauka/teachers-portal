import { Externals } from '../context/production-context';
import { Country } from '../types/country';
import { Language } from '../types/language';
import { findById, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const COUNTRIES_COLLECTION = 'Countries';

export class CountryRepository {
  constructor(private readonly externals: Externals) {}

  public fetchCountryById(id: string): Promise<Country> {
    return withLogger(
      `fetchCountryById ${id}`,
      findById<Language>(this.externals, COUNTRIES_COLLECTION, id)
    );
  }

  public fetchCountryByTitle(title: string): Promise<Country> {
    return withLogger(
      `fetchCountryByTitle ${title}`,
      findSingleRecordSafe(
        this.externals.wixData
          .query(COUNTRIES_COLLECTION)
          .eq('title', title)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
