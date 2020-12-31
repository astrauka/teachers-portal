import { Teacher } from '../common/entities/teacher';
import { Externals } from '../context/production-context';
import { ContactInfo, RegistrationResult } from '../types/wix-types';
import { withLogger } from '../utils/logger';
import User = wix_users.User;

export class UsersService {
  constructor(private readonly externals: Externals) {}

  public async signInTeacher(teacher: Teacher, password: string): Promise<string> {
    return withLogger(
      `signInTeacher ${teacher.email}`,
      this.externals.wixUsers.login(teacher.email, password)
    );
  }

  public async registerUser(teacher: Teacher, password: string): Promise<RegistrationResult> {
    const contactInfo = {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
    } as ContactInfo;
    return withLogger(
      `registerUser ${teacher.email}`,
      this.externals.wixUsers.register(teacher.email, password, { contactInfo })
    );
  }

  public getCurrentUserEmail(): Promise<string> {
    return this.getCurrentUser().getEmail();
  }

  private getCurrentUser(): User {
    return this.externals.wixUsers.currentUser;
  }
}
