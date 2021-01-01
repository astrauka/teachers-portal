import { Teacher } from '../../../../common/entities/teacher';
import { SiteMembersRepository } from '../../../repositories/site-members-repository';
import { UsersService } from '../../../services/users-service';
import { GeneratePassword } from '../../operations/generate-password';

export function registerTeacherFactory(
  siteMembersRepository: SiteMembersRepository,
  usersService: UsersService,
  generatePassword: GeneratePassword
) {
  return async function registerTeacher(teacher: Teacher): Promise<Teacher> {
    if (!(await siteMembersRepository.fetchMemberByEmail(teacher.email))) {
      await usersService.registerUser(teacher, await generatePassword(teacher.email));
    }
    return teacher;
  };
}

export type RegisterTeacher = ReturnType<typeof registerTeacherFactory>;
