import { MembersRepository } from '../../repositories/members-repository';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { UsersService } from '../../services/users-service';
import { TeachersInfo } from '../../types/teachers-info';
import { Member, RegistrationResult } from '../../types/wix-types';
import { getLogger } from '../../utils/logger';
import { GeneratePassword } from './generate-password';

export function addTeacherToUsersFactory(
  membersRepository: MembersRepository,
  usersService: UsersService,
  teachersInfoRepository: TeachersInfoRepository,
  generatePassword: GeneratePassword
) {
  return async function addTeacherToUsers(teachersInfo: TeachersInfo): Promise<Member> {
    const member = await membersRepository.fetchMemberByEmail(teachersInfo.email);
    if (member) {
      return member;
    }
    const { user } = await registerTeacher(teachersInfo);
    await teachersInfoRepository.updateTeacher({ ...teachersInfo, userId: user.id });
    getLogger(`addTeacherToUsers ${teachersInfo.email}`).info('Created site member for a teacher');
    return membersRepository.fetchMemberById(user.id);
  };

  async function registerTeacher(teachersInfo: TeachersInfo): Promise<RegistrationResult> {
    const password = await generatePassword(teachersInfo._id);
    return usersService.registerUser(teachersInfo, password);
  }
}

export type AddTeacherToUsers = ReturnType<typeof addTeacherToUsersFactory>;
