import { Teacher } from '../../../../common/entities/teacher';
import { SiteMembersRepository } from '../../../repositories/site-members-repository';
import { TeachersRepository } from '../../../repositories/teachers-repository';
import { UsersService } from '../../../services/users-service';
import { SiteMember } from '../../../types/wix-types';
import { getLogger } from '../../../utils/logger';
import { GeneratePassword } from '../../operations/generate-password';

export function registerTeacherFactory(
  siteMembersRepository: SiteMembersRepository,
  usersService: UsersService,
  teachersRepository: TeachersRepository,
  generatePassword: GeneratePassword
) {
  return async function registerTeacher(teacher: Teacher): Promise<SiteMember> {
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

export type RegisterTeacher = ReturnType<typeof registerTeacherFactory>;
