import { TeachersRepository } from '../../repositories/teachers-repository';
import { GoogleAuthService } from '../../services/google-auth-service';
import { UsersService } from '../../services/users-service';
import { UnauthorizedError } from '../../utils/errors';
import { withLogger } from '../../utils/logger';
import { GeneratePassword } from './generate-password';

export function authenticateTeacherFactory(
  googleAuthService: GoogleAuthService,
  teachersRepository: TeachersRepository,
  usersService: UsersService,
  generatePassword: GeneratePassword
) {
  return async function authenticateTeacher(idToken: string): Promise<string> {
    const googleUser = await googleAuthService.verifyGoogleToken(idToken);

    return withLogger(`authenticateTeacher ${googleUser.email}`, async () => {
      const teacher = await teachersRepository.fetchTeacherByEmail(googleUser.email);
      if (!teacher) {
        throw new UnauthorizedError('Invalid email - not a teacher');
      }
      const password = await generatePassword(teacher.email);
      return usersService.signInTeacher(teacher, password);
    });
  };
}

export type AuthenticateTeacher = ReturnType<typeof authenticateTeacherFactory>;
