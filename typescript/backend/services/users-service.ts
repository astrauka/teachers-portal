import { Externals } from '../context/production-context';
import { SiteMembersRepository } from '../repositories/site-members-repository';
import { ContactInfo } from '../types/wix-types';
import { Teacher } from '../universal/entities/teacher';
import { withLogger } from '../utils/logger';

import User = wix_users.User;
import UserInfo = wix_users_backend.UserInfo;

export class UsersService {
  constructor(
    private readonly externals: Externals,
    private readonly siteMembersRepository: SiteMembersRepository
  ) {}

  public async generateSessionToken(teacher: Teacher): Promise<string> {
    return withLogger(
      `signInTeacher ${teacher.email}`,
      this.externals.wixUsers.generateSessionToken(teacher.email)
    );
  }

  public async registerUser(teacher: Teacher, password: string): Promise<string> {
    const contactInfo = {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
    } as ContactInfo;
    return withLogger(`registerUser ${teacher.email}`, async () => {
      const { approvalToken } = await this.externals.wixUsers.register(teacher.email, password, {
        contactInfo,
        privacyStatus: 'PUBLIC',
      });
      return await this.externals.wixUsers.approveByToken(approvalToken);
    });
  }

  public async approveUser(teacher: Teacher): Promise<string> {
    return withLogger(`approveUser ${teacher.email}`, async () => {
      return await this.externals.wixUsers.approveByEmail(teacher.email);
    });
  }

  public async updateUserFields(userId: string, userInfo: Partial<UserInfo>) {
    return this.externals.wixUsers.updateUserFields(userId, userInfo as UserInfo);
  }

  public getCurrentUserEmail(): Promise<string> {
    return this.getCurrentUser().getEmail();
  }

  public async deleteUserByEmail(email: string): Promise<void> {
    const siteMember = await this.siteMembersRepository.fetchMemberByEmail(email);
    if (siteMember) {
      return withLogger(
        `deleteUserByEmail ${email}`,
        this.externals.wixUsers.deleteUser(siteMember._id)
      );
    }
  }

  private getCurrentUser(): User {
    return this.externals.wixUsers.currentUser;
  }
}
