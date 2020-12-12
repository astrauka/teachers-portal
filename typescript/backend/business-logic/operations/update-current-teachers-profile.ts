import { omit } from 'lodash';
import { TaskNumber } from '../../common/entities/task';
import { TeachersInfo } from '../../common/entities/teachers-info';
import { TeachersProfile, TeachersProfileUpdate } from '../../common/entities/teachers-profile';
import { CountryRepository } from '../../repositories/country-repository';
import { LanguageRepository } from '../../repositories/language-repository';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { validateTeachersProfileUpdate } from '../validators';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';

export function updateCurrentTeachersProfileFactory(
  teachersProfileRepository: TeachersProfileRepository,
  countryRepository: CountryRepository,
  languageRepository: LanguageRepository,
  getCurrentTeachersInfo: GetCurrentTeachersInfo,
  completeTeachersTask: CompleteTeachersTask
) {
  return async function updateCurrentTeachersProfile(
    update: TeachersProfileUpdate
  ): Promise<TeachersProfile> {
    validateTeachersProfileUpdate(update);
    const [teachersInfo, country, language] = await Promise.all([
      getCurrentTeachersInfo(),
      countryRepository.fetchCountryByTitleOrThrow(update.country),
      languageRepository.fetchLanguageByTitleOrThrow(update.language),
    ]);
    const updateWithIds = {
      ...omit(update, ['country', 'language']),
      countryId: country._id,
      languageId: language._id,
    } as TeachersProfile;
    const teachersProfile = await persistProfile(teachersInfo, updateWithIds);
    await completeTeachersTask(TaskNumber.initialProfileForm);
    return teachersProfile;
  };

  async function persistProfile(
    teachersInfo: TeachersInfo,
    updateWithIds: TeachersProfile
  ): Promise<TeachersProfile> {
    const { email, firstName, lastName, levelId, statusId } = teachersInfo;
    const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(email);
    if (teachersProfile) {
      return teachersProfileRepository.updateTeachersProfile({
        ...teachersProfile,
        ...updateWithIds,
      });
    }

    return teachersProfileRepository.insertTeachersProfile({
      ...updateWithIds,
      email,
      fullName: `${firstName} ${lastName}`,
      levelId,
      statusId,
      teachersInfoId: teachersInfo._id,
    });
  }
}
