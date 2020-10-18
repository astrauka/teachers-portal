import { compact, get, keyBy } from 'lodash';
export function makeTeachersProfileViewsFactory(countryRepository, languageRepository) {
    return async function makeTeachersProfileViews(teachersProfilesArray) {
        const teachersProfiles = compact(teachersProfilesArray);
        const countryIds = compact(teachersProfiles.map((teachersProfile) => teachersProfile.countryId));
        const languageIds = compact(teachersProfiles.map((teachersProfile) => teachersProfile.languageId));
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
