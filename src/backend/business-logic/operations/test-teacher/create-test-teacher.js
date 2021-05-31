import { TEST_TEACHER_INITIAL_DATA } from '../../../universal/entities/test-teacher';
export function createTestTeacherFactory(teachersRepository) {
    return async function createTestTeacher() {
        return await teachersRepository.createTeacher(TEST_TEACHER_INITIAL_DATA);
    };
}
