import { withLogger } from '../utils/logger';
export class UsersService {
    constructor(externals, siteMembersRepository) {
        this.externals = externals;
        this.siteMembersRepository = siteMembersRepository;
    }
    async generateSessionToken(teacher) {
        return withLogger(`signInTeacher ${teacher.email}`, this.externals.wixUsers.generateSessionToken(teacher.email));
    }
    async registerUser(teacher, password) {
        const contactInfo = {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
        };
        return withLogger(`registerUser ${teacher.email}`, async () => {
            const { approvalToken } = await this.externals.wixUsers.register(teacher.email, password, {
                contactInfo,
                privacyStatus: 'PUBLIC',
            });
            return await this.externals.wixUsers.approveByToken(approvalToken);
        });
    }
    async approveUser(teacher) {
        return withLogger(`approveUser ${teacher.email}`, async () => {
            return await this.externals.wixUsers.approveByEmail(teacher.email);
        });
    }
    async updateUserFields(userId, userInfo) {
        return this.externals.wixUsers.updateUserFields(userId, userInfo);
    }
    getCurrentUserEmail() {
        return this.getCurrentUser().getEmail();
    }
    async deleteUserByEmail(email) {
        const siteMember = await this.siteMembersRepository.fetchMemberByEmail(email);
        if (siteMember) {
            return withLogger(`deleteUserByEmail ${email}`, this.externals.wixUsers.deleteUser(siteMember._id));
        }
    }
    getCurrentUser() {
        return this.externals.wixUsers.currentUser;
    }
}
