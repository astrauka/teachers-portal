export function getCuratingTeachersProfileFactory(getCurrentTeachersInfo, getTeachersProfile, teachersInfoRepository) {
    return async function getCuratingTeachersProfile() {
        const { mentorId } = await getCurrentTeachersInfo();
        if (!mentorId) {
            return;
        }
        const curatingTeacher = await teachersInfoRepository.fetchTeacherById(mentorId);
        if (!curatingTeacher) {
            return;
        }
        return getTeachersProfile(curatingTeacher.email);
    };
}
