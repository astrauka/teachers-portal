import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { GoogleAuthService } from '../../services/google-auth-service';
import { UsersService } from '../../services/users-service';
import { UnauthorizedError } from '../../utils/errors';
import { withLogger } from '../../utils/logger';
import { GeneratePassword } from './generate-password';

export function authenticateTeacherFactory(
  googleAuthService: GoogleAuthService,
  teachersInfoRepository: TeachersInfoRepository,
  usersService: UsersService,
  generatePassword: GeneratePassword
) {
  return async function authenticateTeacher(idToken: string): Promise<string> {
    const googleUser = await googleAuthService.verifyGoogleToken(idToken);

    return withLogger(`authenticateTeacher ${googleUser.email}`, async () => {
      const teachersInfo = await teachersInfoRepository.fetchTeacherByEmail(googleUser.email);
      if (!teachersInfo) {
        throw new UnauthorizedError('Invalid email - not a teacher');
      }
      const password = await generatePassword(teachersInfo._id);
      return usersService.signInTeacher(teachersInfo, password);
    });
  };
}

export type AuthenticateTeacher = ReturnType<typeof authenticateTeacherFactory>;
