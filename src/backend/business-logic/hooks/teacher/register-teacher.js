import { MemberStatus } from '../../../common/common-wix-types';
import { generateUuid } from '../../../utils/id';
export function registerTeacherFactory(siteMembersRepository, usersService, generatePassword = generateUuid) {
    return async function registerTeacher(teacher) {
        const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (!siteMember) {
            await usersService.registerUser(teacher, generatePassword());
        }
        else if (siteMember.status === MemberStatus.Applicant) {
            await usersService.approveUser(teacher);
        }
        return teacher;
    };
}
