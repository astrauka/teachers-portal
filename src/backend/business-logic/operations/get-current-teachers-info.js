import { NotLoggedInError } from '../../utils/errors';
export function getCurrentTeachersInfoFactory(teachersInfoRepository, usersService) {
    return async function getCurrentTeachersInfo() {
        const teachersInfo = await teachersInfoRepository.fetchTeacherByEmail(await usersService.getCurrentUserEmail());
        if (teachersInfo) {
            return teachersInfo;
        }
        throw new NotLoggedInError();
    };
}
