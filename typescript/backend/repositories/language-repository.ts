import { Language } from '../common/entities/language';
import { Externals } from '../context/production-context';
import { fetchRecords, findSingleRecordOrThrow } from '../utils/database-queries';
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
          .hasSome('_id', ids)
          .find({ suppressAuth: true })
      )
    );
  }

  public fetchLanguageByTitleOrThrow(title: string): Promise<Language> {
    return withLogger(
      `fetchLanguageByTitleOrThrow ${title}`,
      findSingleRecordOrThrow(
        this.externals.wixData
          .query(LANGUAGES_COLLECTION)
          .eq('title', title)
          .limit(1)
          .find({ suppressAuth: true })
      )
    );
  }
}
