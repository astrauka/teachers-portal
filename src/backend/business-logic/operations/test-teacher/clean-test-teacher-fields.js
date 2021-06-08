import { TEST_TEACHER_EMAIL, TEST_TEACHER_INITIAL_DATA, } from '../../../universal/entities/test-teacher';
export function cleanTestTeacherFieldsFactory(teachersRepository) {
    return async function cleanTestTeacherFields() {
        const teacher = await teachersRepository.fetchTeacherByEmailOrThrow(TEST_TEACHER_EMAIL, false);
        return await teachersRepository.updateTeacher({
            _id: teacher._id,
            ...TEST_TEACHER_INITIAL_DATA,
        });
    };
}
