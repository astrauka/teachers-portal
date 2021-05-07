import { Country } from '../common/entities/country';
import { Externals } from '../context/production-context';
import { findByIdOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const COUNTRIES_COLLECTION = 'Countries';

export class CountriesRepository {
  constructor(private readonly externals: Externals) {}

  public fetchCountryByIdOrThrow(id: string): Promise<Country> {
    return withLogger(
      `fetchCountryByIdOrThrow ${id}`,
      findByIdOrThrow<Country>(this.externals, COUNTRIES_COLLECTION, id)
    );
  }
}
