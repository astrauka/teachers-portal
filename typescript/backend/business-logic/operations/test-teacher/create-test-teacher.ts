import { TeachersRepository } from '../../../repositories/teachers-repository';
import { Teacher } from '../../../universal/entities/teacher';
import { TEST_TEACHER_INITIAL_DATA } from '../../../universal/entities/test-teacher';

export type CreateTestTeacher = ReturnType<typeof createTestTeacherFactory>;

export function createTestTeacherFactory(teachersRepository: TeachersRepository) {
  return async function createTestTeacher(): Promise<Teacher> {
    return await teachersRepository.createTeacher(TEST_TEACHER_INITIAL_DATA);
  };
}
