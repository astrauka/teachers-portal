import { replace } from 'lodash';
import { MemberStatus } from '../../common/common-wix-types';
import { Teacher } from '../../common/entities/teacher';
import { SiteMembersRepository } from '../../repositories/site-members-repository';
import { UsersService } from '../../services/users-service';
import { generateUuid, IdProvider } from '../../utils/id';

export function registerTeacherFactory(
  siteMembersRepository: SiteMembersRepository,
  usersService: UsersService,
  generatePassword: IdProvider = generateUuid
) {
  return async function registerTeacher(teacher: Teacher): Promise<Teacher> {
    const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
    if (!siteMember) {
      const password = replace(generatePassword(), /-/g, '').substr(0, 12);
      await usersService.registerUser(teacher, password);
    } else if (siteMember.status === MemberStatus.Applicant) {
      await usersService.approveUser(teacher);
    }
    return teacher;
  };
}

export type RegisterTeacher = ReturnType<typeof registerTeacherFactory>;
