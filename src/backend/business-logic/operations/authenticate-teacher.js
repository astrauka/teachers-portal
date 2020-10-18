import { UnauthorizedError } from '../../utils/errors';
import { withLogger } from '../../utils/logger';
export function authenticateTeacherFactory(googleAuthService, teachersInfoRepository, usersService, generatePassword) {
    return async function authenticateTeacher(idToken) {
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
