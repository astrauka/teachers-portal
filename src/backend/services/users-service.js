import { withLogger } from '../utils/logger';
export class UsersService {
    constructor(externals) {
        this.externals = externals;
    }
    async signInTeacher(teachersInfo, password) {
        return withLogger(`signInTeacher ${teachersInfo.email}`, this.externals.wixUsers.login(teachersInfo.email, password));
    }
    async registerUser(teachersInfo, password) {
        const contactInfo = {
            firstName: teachersInfo.firstName,
            lastName: teachersInfo.lastName,
        };
        return withLogger(`registerUser ${teachersInfo.email}`, this.externals.wixUsers.register(teachersInfo.email, password, { contactInfo }));
    }
    getCurrentUserEmail() {
        return this.getCurrentUser().getEmail();
    }
    getCurrentUser() {
        return this.externals.wixUsers.currentUser;
    }
}
