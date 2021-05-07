export function getCuratingTeacherFactory(getCurrentTeacher, teachersRepository) {
    return async function getCuratingTeacher() {
        const { mentorId } = await getCurrentTeacher();
        if (!mentorId) {
            return;
        }
        return await teachersRepository.fetchTeacherById(mentorId);
    };
}
