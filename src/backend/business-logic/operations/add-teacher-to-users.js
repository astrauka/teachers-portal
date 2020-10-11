import { getLogger } from '../../utils/logger';
export function addTeacherToUsersFactory(membersRepository, usersService, teachersInfoRepository, generatePassword) {
    return async function addTeacherToUsers(teachersInfo) {
        const member = await membersRepository.fetchMemberByEmail(teachersInfo.email);
        if (member) {
            return member;
        }
        const { user } = await registerTeacher(teachersInfo);
        await teachersInfoRepository.updateTeacher({ ...teachersInfo, userId: user.id });
        getLogger(`addTeacherToUsers ${teachersInfo.email}`).info('Created site member for a teacher');
        return membersRepository.fetchMemberById(user.id);
    };
    async function registerTeacher(teachersInfo) {
        const password = await generatePassword(teachersInfo._id);
        return usersService.registerUser(teachersInfo, password);
    }
}
