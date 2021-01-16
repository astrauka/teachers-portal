import { MemberStatus } from '../../../common/common-wix-types';
export function registerTeacherFactory(siteMembersRepository, usersService, generatePassword) {
    return async function registerTeacher(teacher) {
        const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (!siteMember) {
            await usersService.registerUser(teacher, await generatePassword(teacher.email));
        }
        else if (siteMember.status === MemberStatus.Applicant) {
            await usersService.approveUser(teacher);
        }
        return teacher;
    };
}
