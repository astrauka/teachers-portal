export function getCuratingTeacherFactory(getTeacher, teachersRepository) {
    return async function getCuratingTeacher() {
        const { mentorId } = await getTeacher();
        if (!mentorId) {
            return;
        }
        return await teachersRepository.fetchTeacherById(mentorId);
    };
}
