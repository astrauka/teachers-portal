import { get } from 'lodash';
export function getTeachersProfileFactory(countryRepository, languageRepository, teachersProfileRepository, usersService) {
    return async function getTeachersProfile(email) {
        const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(email || (await usersService.getCurrentUserEmail()));
        if (!teachersProfile) {
            return;
        }
        const { countryId, languageId } = teachersProfile;
        const [country, language] = await Promise.all([
            countryId ? countryRepository.fetchCountryById(countryId) : undefined,
            languageId ? languageRepository.fetchLanguageById(languageId) : undefined,
        ]);
        return { ...teachersProfile, country: get(country, 'title'), language: get(language, 'title') };
    };
}
