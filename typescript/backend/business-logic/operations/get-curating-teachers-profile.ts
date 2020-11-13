import { TeachersProfile } from '../../../common/types/teachers-profile';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';
import { GetTeachersProfile } from './get-teachers-profile';

export function getCuratingTeachersProfileFactory(
  getCurrentTeachersInfo: GetCurrentTeachersInfo,
  getTeachersProfile: GetTeachersProfile,
  teachersInfoRepository: TeachersInfoRepository
) {
  return async function getCuratingTeachersProfile(): Promise<TeachersProfile | undefined> {
    const { mentorId } = await getCurrentTeachersInfo();
    if (!mentorId) {
      return;
    }
    const curatingTeacher = await teachersInfoRepository.fetchTeacherById(mentorId);
    if (!curatingTeacher) {
      return;
    }
    return getTeachersProfile(curatingTeacher.email);
  };
}
