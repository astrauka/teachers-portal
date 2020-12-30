import { getLogger } from '../../../utils/logger';
export function registerTeacherFactory(siteMembersRepository, usersService, teachersRepository, generatePassword) {
    return async function registerTeacher(teacher) {
        const member = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (member) {
            return member;
        }
        const { user } = await usersService.registerUser(teacher, await generatePassword(teacher._id));
        await teachersRepository.updateTeacher({ ...teacher, siteMemberId: user.id });
        getLogger(`registerTeacher ${teacher.email}`).info('Created site member for a teacher');
        return siteMembersRepository.fetchMemberByEmail(teacher.email);
    };
}
