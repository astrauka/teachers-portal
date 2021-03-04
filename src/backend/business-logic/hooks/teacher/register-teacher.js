import { replace } from 'lodash';
import { MemberStatus } from '../../../common/common-wix-types';
import { generateUuid } from '../../../utils/id';
export function registerTeacherFactory(siteMembersRepository, usersService, generatePassword = generateUuid) {
    return async function registerTeacher(teacher) {
        const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (!siteMember) {
            const password = replace(generatePassword(), /-/g, '').substr(0, 12);
            await usersService.registerUser(teacher, password);
        }
        else if (siteMember.status === MemberStatus.Applicant) {
            await usersService.approveUser(teacher);
        }
        return teacher;
    };
}
