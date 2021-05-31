import { TEST_TEACHER_EMAIL } from '../../../universal/entities/test-teacher';
export function cleanTestTeacherFactory(teachersRepository, usersService) {
    return async function cleanTestTeacher() {
        await usersService.deleteUserByEmail(TEST_TEACHER_EMAIL);
        await teachersRepository.removeTeacherByEmail(TEST_TEACHER_EMAIL);
    };
}
