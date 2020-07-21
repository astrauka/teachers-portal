import { omit } from 'lodash';
import { CountryRepository } from '../repositories/country-repository';
import { LanguageRepository } from '../repositories/language-repository';
import { MembersRepository } from '../repositories/members-repository';
import { TeachersProfileRepository } from '../repositories/teachers-profile-repository';
import { UsersService } from '../services/users-service';
import { TaskNumber } from '../types/task';
import {
  TeachersProfile,
  TeachersProfileUpdate,
  validateTeachersProfileUpdate,
} from '../types/teachers-profile';
import { CompleteTeachersTask } from './complete-teachers-task';

export function updateCurrentTeachersProfileFactory(
  teachersProfileRepository: TeachersProfileRepository,
  usersService: UsersService,
  membersRepository: MembersRepository,
  countryRepository: CountryRepository,
  languageRepository: LanguageRepository,
  completeTeachersTask: CompleteTeachersTask
) {
  return async function updateCurrentTeachersProfile(
    update: TeachersProfileUpdate
  ): Promise<TeachersProfile> {
    validateTeachersProfileUpdate(update);
    const [email, country, language] = await Promise.all([
      usersService.getCurrentUserEmail(),
      countryRepository.fetchCountryByTitle(update.country),
      languageRepository.fetchLanguageByTitle(update.language),
    ]);
    const updateWithIds = {
      ...omit(update, ['country', 'language']),
      countryId: country._id,
      languageId: language._id,
    } as TeachersProfile;
    const teachersProfile = await persistProfile(email, updateWithIds);
    await completeTeachersTask(TaskNumber.initialProfileForm);
    return teachersProfile;
  };

  async function persistProfile(
    email: string,
    updateWithIds: TeachersProfile
  ): Promise<TeachersProfile> {
    const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(email);
    if (teachersProfile) {
      return teachersProfileRepository.updateTeachersProfile({
        ...teachersProfile,
        ...updateWithIds,
      });
    }

    const member = await membersRepository.fetchMemberByEmail(email);
    return teachersProfileRepository.insertTeachersProfile({
      ...updateWithIds,
      email,
      userId: member._id,
    } as TeachersProfile);
  }
}
