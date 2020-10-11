export function getCuratingTeachersProfileFactory(getCurrentTeachersInfo, teachersInfoRepository) {
    return async function getCuratingTeachersProfile() {
        const { mentorId } = await getCurrentTeachersInfo();
        if (!mentorId) {
            return;
        }
    };
}
