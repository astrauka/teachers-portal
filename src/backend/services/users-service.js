import { withLogger } from '../utils/logger';
export class UsersService {
    constructor(externals) {
        this.externals = externals;
    }
    async signInTeacher(teacher, password) {
        return withLogger(`signInTeacher ${teacher.email}`, this.externals.wixUsers.login(teacher.email, password));
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
    getCurrentUser() {
        return this.externals.wixUsers.currentUser;
    }
}
