import { TeachersInfo } from '../../common/types/teachers-info';
import { User } from '../../common/types/wix-types';
import { Externals } from '../context/production-context';
import { ContactInfo, RegistrationResult } from '../types/wix-types';
import { withLogger } from '../utils/logger';

export class UsersService {
  constructor(private readonly externals: Externals) {}

  public async signInTeacher(teachersInfo: TeachersInfo, password: string): Promise<string> {
    return withLogger(
      `signInTeacher ${teachersInfo.email}`,
      this.externals.wixUsers.login(teachersInfo.email, password)
    );
  }

  public async registerUser(
    teachersInfo: TeachersInfo,
    password: string
  ): Promise<RegistrationResult> {
    const contactInfo = {
      firstName: teachersInfo.firstName,
      lastName: teachersInfo.lastName,
    } as ContactInfo;
    return withLogger(
      `registerUser ${teachersInfo.email}`,
      this.externals.wixUsers.register(teachersInfo.email, password, { contactInfo })
    );
  }

  public getCurrentUserEmail(): Promise<string> {
    return this.getCurrentUser().getEmail();
  }

  private getCurrentUser(): User {
    return this.externals.wixUsers.currentUser;
  }
}
