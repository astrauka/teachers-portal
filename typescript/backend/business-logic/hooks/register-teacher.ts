import { replace } from 'lodash';
import { SiteMembersRepository } from '../../repositories/site-members-repository';
import { UsersService } from '../../services/users-service';
import { Teacher } from '../../universal/entities/teacher';
import { MemberStatus } from '../../universal/wix-types';
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
