export function getCurrentTeachersInfoFactory(teachersInfoRepository, usersService) {
    return async function getCurrentTeachersInfo() {
        return teachersInfoRepository.fetchTeacherByEmail(await usersService.getCurrentUserEmail());
    };
}
