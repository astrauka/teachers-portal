import { Teacher } from '../../../../common/entities/teacher';
import { MemberStatus } from '../../../common/common-wix-types';
import { SiteMembersRepository } from '../../../repositories/site-members-repository';
import { UsersService } from '../../../services/users-service';
import { generateUuid, IdProvider } from '../../../utils/id';

export function registerTeacherFactory(
  siteMembersRepository: SiteMembersRepository,
  usersService: UsersService,
  generatePassword: IdProvider = generateUuid
) {
  return async function registerTeacher(teacher: Teacher): Promise<Teacher> {
    const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
    if (!siteMember) {
      await usersService.registerUser(teacher, generatePassword());
    } else if (siteMember.status === MemberStatus.Applicant) {
      await usersService.approveUser(teacher);
    }
    return teacher;
  };
}

export type RegisterTeacher = ReturnType<typeof registerTeacherFactory>;
