import { Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { GetTeacher } from './get-teacher';

export function getCuratingTeacherFactory(
  getTeacher: GetTeacher,
  teachersRepository: TeachersRepository
) {
  return async function getCuratingTeacher(): Promise<Teacher | undefined> {
    const { mentorId } = await getTeacher();
    if (!mentorId) {
      return;
    }
    return await teachersRepository.fetchTeacherById(mentorId);
  };
}
