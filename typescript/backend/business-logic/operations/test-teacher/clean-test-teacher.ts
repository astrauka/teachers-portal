import { TeachersRepository } from '../../../repositories/teachers-repository';
import { UsersService } from '../../../services/users-service';
import { TEST_TEACHER_EMAIL } from '../../../universal/entities/test-teacher';

export type CleanTestTeacher = ReturnType<typeof cleanTestTeacherFactory>;

export function cleanTestTeacherFactory(
  teachersRepository: TeachersRepository,
  usersService: UsersService
) {
  return async function cleanTestTeacher(): Promise<void> {
    await usersService.deleteUserByEmail(TEST_TEACHER_EMAIL);
    await teachersRepository.removeTeacherByEmail(TEST_TEACHER_EMAIL);
  };
}
