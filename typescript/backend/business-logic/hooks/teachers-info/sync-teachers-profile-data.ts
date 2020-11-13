import { isEqual, pick } from 'lodash';
import { TeachersInfo } from '../../../../common/types/teachers-info';
import { TeachersProfile } from '../../../../common/types/teachers-profile';
import { TeachersProfileRepository } from '../../../repositories/teachers-profile-repository';
import { WixHookContext } from '../../../types/wix-types';

const FIELDS_TO_COPY = ['email', 'statusId', 'levelId', 'firstName', 'lastName'];

export function syncTeachersProfileDataFactory(
  teachersProfileRepository: TeachersProfileRepository
) {
  return async function syncTeachersProfileData(
    teachersInfo: TeachersInfo,
    { currentItem }: WixHookContext<TeachersInfo>
  ): Promise<TeachersInfo> {
    await updateTeachersProfileDetails(teachersInfo, currentItem);
    return teachersInfo;
  };

  async function updateTeachersProfileDetails(
    teachersInfo: TeachersInfo,
    currentTeachersInfo: TeachersInfo
  ): Promise<TeachersProfile | undefined> {
    if (isEqual(pick(teachersInfo, FIELDS_TO_COPY), pick(currentTeachersInfo, FIELDS_TO_COPY))) {
      return;
    }
    const { email, statusId, levelId, firstName, lastName } = teachersInfo;
    const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByTeachersInfoId(
      teachersInfo._id
    );
    if (teachersProfile) {
      return teachersProfileRepository.updateTeachersProfile({
        ...teachersProfile,
        email,
        fullName: `${firstName} ${lastName}`,
        levelId,
        statusId,
        teachersInfoId: teachersInfo._id,
      });
    }
  }
}
