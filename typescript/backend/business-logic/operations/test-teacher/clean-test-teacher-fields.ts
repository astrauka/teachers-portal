import { TeachersRepository } from '../../../repositories/teachers-repository';
import { Teacher } from '../../../universal/entities/teacher';
import {
  TEST_TEACHER_EMAIL,
  TEST_TEACHER_INITIAL_DATA,
} from '../../../universal/entities/test-teacher';

export type CleanTestTeacherFields = ReturnType<typeof cleanTestTeacherFieldsFactory>;

export function cleanTestTeacherFieldsFactory(teachersRepository: TeachersRepository) {
  return async function cleanTestTeacherFields(): Promise<Teacher> {
    const teacher = await teachersRepository.fetchTeacherByEmailOrThrow(TEST_TEACHER_EMAIL, false);
    return await teachersRepository.updateTeacher({
      _id: teacher._id,
      ...TEST_TEACHER_INITIAL_DATA,
    });
  };
}
