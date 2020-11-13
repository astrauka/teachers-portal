import { buildMember } from '../../../../test/builders/member';
import { buildTeachersInfo } from '../../../../test/builders/teachers-info';
import { buildRegistrationResult } from '../../../../test/builders/user';
import { expect } from '../../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../../test/utils/stubbing';
import { MembersRepository } from '../../../repositories/members-repository';
import { TeachersInfoRepository } from '../../../repositories/teachers-info-repository';
import { UsersService } from '../../../services/users-service';
import { addTeacherToUsersFactory } from './add-teacher-to-users';
describe('addTeacherToUsers', () => {
    const member = undefined;
    const registrationResult = buildRegistrationResult({ id: 'user' });
    const user = registrationResult.user;
    const memberByUserId = buildMember({ id: user.id });
    const teachersInfo = buildTeachersInfo({ id: 'teacher-id', without: ['userId'] });
    const password = 'teacher-password';
    const registeredTeachersInfo = { ...teachersInfo, userId: user.id };
    const getMembersService = (member) => createStubInstance(MembersRepository, (stub) => {
        stub.fetchMemberByEmail.resolves(member);
        stub.fetchMemberById.resolves(memberByUserId);
    });
    const getUsersService = () => createStubInstance(UsersService, (stub) => {
        stub.registerUser.resolves(registrationResult);
    });
    const getTeachersService = () => createStubInstance(TeachersInfoRepository, (stub) => {
        stub.updateTeacher.resolves(registeredTeachersInfo);
    });
    const getGeneratePassword = (password) => stubFn().resolves(password);
    const buildTestContext = ({ membersRepository = getMembersService(member), usersService = getUsersService(), teachersInfoRepository = getTeachersService(), generatePassword = getGeneratePassword(password), } = {}) => ({
        membersRepository,
        usersService,
        teachersInfoRepository,
        generatePassword,
        addTeacherToUsers: addTeacherToUsersFactory(membersRepository, usersService, teachersInfoRepository, generatePassword),
    });
    it('should register teacher, update teacher info and return member', async () => {
        const { usersService, membersRepository, teachersInfoRepository, generatePassword, addTeacherToUsers, } = buildTestContext();
        expect(await addTeacherToUsers(teachersInfo)).to.eql(memberByUserId);
        expect(generatePassword).calledOnceWithExactly(teachersInfo._id);
        expect(membersRepository.fetchMemberByEmail).calledOnceWithExactly(teachersInfo.email);
        expect(usersService.registerUser).calledOnceWithExactly(teachersInfo, password);
        expect(teachersInfoRepository.updateTeacher).calledOnceWithExactly(registeredTeachersInfo);
        expect(membersRepository.fetchMemberById).calledOnceWithExactly(memberByUserId._id);
    });
    context('for registered member', () => {
        const member = buildMember({ id: 'member' });
        it('should return the member', async () => {
            const { usersService, membersRepository, teachersInfoRepository, addTeacherToUsers, } = buildTestContext({
                membersRepository: getMembersService(member),
            });
            expect(await addTeacherToUsers(teachersInfo)).to.eql(member);
            expect(membersRepository.fetchMemberByEmail).calledOnceWithExactly(teachersInfo.email);
            expect(usersService.registerUser).not.called;
            expect(teachersInfoRepository.updateTeacher).not.called;
            expect(membersRepository.fetchMemberById).not.called;
        });
    });
});
