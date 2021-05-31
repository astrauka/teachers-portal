import { replace } from 'lodash';
import { TEST_TEACHER_EMAIL } from '../../universal/entities/test-teacher';
import { MemberStatus } from '../../universal/wix-types';
import { generateUuid } from '../../utils/id';
export function registerTeacherFactory(siteMembersRepository, usersService, secretsService, generatePassword = generateUuid) {
    return async function registerTeacher(teacher) {
        const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (!siteMember) {
            const password = teacher.email === TEST_TEACHER_EMAIL
                ? await secretsService.getTestTeacherPassword()
                : replace(generatePassword(), /-/g, '').substr(0, 12);
            await usersService.registerUser(teacher, password);
        }
        else if (siteMember.status === MemberStatus.Applicant) {
            await usersService.approveUser(teacher);
        }
        return teacher;
    };
}
