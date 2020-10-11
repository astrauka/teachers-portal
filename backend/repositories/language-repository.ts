import { Externals } from '../context/production-context';
import { Language } from '../types/language';
import { fetchRecords, findSingleRecordSafe } from '../utils/database-queries';
import { withLogger } from '../utils/logger';

const LANGUAGES_COLLECTION = 'Languages';

export class LanguageRepository {
  constructor(private readonly externals: Externals) {}

  public fetchLanguagesByIds(ids: string[]): Promise<Language[]> {
    return withLogger(
      `fetchLanguagesByIds ${ids}`,
      fetchRecords<Language>(
        this.externals.wixData
          .query(LANGUAGES_COLLECTION)
          .eq('id', ids)
          .find({ suppressAuth: true })
      )
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
