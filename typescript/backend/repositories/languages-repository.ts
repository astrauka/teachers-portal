import { Externals } from '../context/production-context';
import { Language } from '../universal/entities/language';
import { findByIdOrThrow } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const LANGUAGES_COLLECTION = 'Languages';

export class LanguagesRepository {
  constructor(private readonly externals: Externals) {}

  public fetchLanguageByIdOrThrow(id: string): Promise<Language> {
    return withLogger(
      `fetchLanguageByIdOrThrow ${id}`,
      findByIdOrThrow<Language>(this.externals, LANGUAGES_COLLECTION, id)
    );
  }
}
