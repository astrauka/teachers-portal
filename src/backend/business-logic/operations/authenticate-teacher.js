import { UnauthorizedError } from '../../utils/errors';
import { withLogger } from '../../utils/logger';
export function authenticateTeacherFactory(googleAuthService, teachersRepository, usersService, generatePassword) {
    return async function authenticateTeacher(idToken) {
        const googleUser = await googleAuthService.verifyGoogleToken(idToken);
        return withLogger(`authenticateTeacher ${googleUser.email}`, async () => {
            const teacher = await teachersRepository.fetchTeacherByEmail(googleUser.email);
            if (!teacher) {
                throw new UnauthorizedError('Invalid email - not a teacher');
            }
            const password = await generatePassword(teacher._id);
            return usersService.signInTeacher(teacher, password);
        });
    };
}
