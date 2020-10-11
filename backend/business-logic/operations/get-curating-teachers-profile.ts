import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { TeachersProfileView } from '../../types/teachers-profile';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';

export function getCuratingTeachersProfileFactory(
  getCurrentTeachersInfo: GetCurrentTeachersInfo,
  teachersInfoRepository: TeachersInfoRepository
) {
  return async function getCuratingTeachersProfile(): Promise<TeachersProfileView | undefined> {
    const { mentorId } = await getCurrentTeachersInfo();
    if (!mentorId) {
      return;
    }
    const curatingTeacher = await teachersInfoRepository.fetchTeacherById(mentorId);
    if (!curatingTeacher) {
      return;
    }
  };
}
