import { get } from 'lodash';
import { CountryRepository } from '../repositories/country-repository';
import { LanguageRepository } from '../repositories/language-repository';
import { TeachersProfileRepository } from '../repositories/teachers-profile-repository';
import { UsersService } from '../services/users-service';
import { TeachersProfileView } from '../types/teachers-profile';

export function getTeachersProfileFactory(
  countryRepository: CountryRepository,
  languageRepository: LanguageRepository,
  teachersProfileRepository: TeachersProfileRepository,
  usersService: UsersService
) {
  return async function getTeachersProfile(
    email?: string
  ): Promise<TeachersProfileView | undefined> {
    const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(
      email || (await usersService.getCurrentUserEmail())
    );
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

export type GetTeachersProfile = ReturnType<typeof getTeachersProfileFactory>;
