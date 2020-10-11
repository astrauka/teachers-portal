export function getTeachersProfileFactory(teachersProfileRepository, usersService) {
    return async function getTeachersProfile(email) {
        return teachersProfileRepository.fetchTeachersProfileByEmail(email || (await usersService.getCurrentUserEmail()));
    };
}
