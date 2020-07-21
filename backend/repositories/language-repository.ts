import { Externals } from '../context/production-context';
import { Language } from '../types/language';
import { findById, findSingleRecord, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const LANGUAGES_COLLECTION = 'Languages';

export class LanguageRepository {
  constructor(private readonly externals: Externals) {}

  public fetchLanguageById(id: string): Promise<Language> {
    return withLogger(
      `fetchLanguageById ${id}`,
      findById<Language>(this.externals, LANGUAGES_COLLECTION, id)
    );
  }

  public fetchLanguageByTitle(title: string): Promise<Language> {
    return withLogger(
      `fetchLanguageByTitle ${title}`,
      findSingleRecordSafe(
        this.externals.wixData
          .query(LANGUAGES_COLLECTION)
          .eq('title', title)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
