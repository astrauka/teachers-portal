export function registerTeacherFactory(siteMembersRepository, usersService, generatePassword) {
    return async function registerTeacher(teacher) {
        if (!(await siteMembersRepository.fetchMemberByEmail(teacher.email))) {
            await usersService.registerUser(teacher, await generatePassword(teacher.email));
        }
        return teacher;
    };
}
