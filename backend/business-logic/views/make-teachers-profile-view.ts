import { compact, get, keyBy } from 'lodash';
import { CountryRepository } from '../../repositories/country-repository';
import { LanguageRepository } from '../../repositories/language-repository';
import { TeachersProfile, TeachersProfileView } from '../../types/teachers-profile';

export function makeTeachersProfileViewsFactory(
  countryRepository: CountryRepository,
  languageRepository: LanguageRepository
) {
  return async function makeTeachersProfileViews(
    teachersProfiles: TeachersProfile[]
  ): Promise<TeachersProfileView[]> {
    const countryIds = compact(
      teachersProfiles.map((teachersProfile) => teachersProfile.countryId)
    );
    const languageIds = compact(
      teachersProfiles.map((teachersProfile) => teachersProfile.languageId)
    );
    const [countries, languages] = await Promise.all([
      countryIds.length ? countryRepository.fetchCountriesByIds(countryIds) : Promise.resolve([]),
      languageIds.length
        ? languageRepository.fetchLanguagesByIds(languageIds)
        : Promise.resolve([]),
    ]);
    const countriesByIds = keyBy(countries, '_id');
    const languagesByIds = keyBy(languages, '_id');
    return teachersProfiles.map((teachersProfile) => ({
      ...teachersProfile,
      country: get(countriesByIds[teachersProfile.countryId], 'title'),
      language: get(languagesByIds[teachersProfile.languageId], 'title'),
    }));
  };
}

export type MakeTeachersProfileViews = ReturnType<typeof makeTeachersProfileViewsFactory>;
