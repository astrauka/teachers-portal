import { get } from 'lodash';
export function getCurrentTeachersProfileFactory(countryRepository, languageRepository, teachersProfileRepository, usersService) {
    return async function getCurrentTeachersProfile() {
        const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(await usersService.getCurrentUserEmail());
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
