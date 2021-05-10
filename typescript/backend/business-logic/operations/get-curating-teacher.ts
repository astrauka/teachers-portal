import { TeachersRepository } from '../../repositories/teachers-repository';
import { Teacher } from '../../universal/entities/teacher';
import { GetCurrentTeacher } from './get-current-teacher';

export function getCuratingTeacherFactory(
  getCurrentTeacher: GetCurrentTeacher,
  teachersRepository: TeachersRepository
) {
  return async function getCuratingTeacher(): Promise<Teacher | undefined> {
    const { mentorId } = await getCurrentTeacher();
    if (!mentorId) {
      return;
    }
    return await teachersRepository.fetchTeacherById(mentorId);
  };
}
