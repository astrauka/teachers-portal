import { buildSiteMember } from '../../../../test/builders/site-member';
import { buildTeacher } from '../../../../test/builders/teacher';
import { buildRegistrationResult } from '../../../../test/builders/user';
import { expect } from '../../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../../test/utils/stubbing';
import { Teacher } from '../../../common/entities/teacher';
import { SiteMembersRepository } from '../../../repositories/site-members-repository';
import { TeachersRepository } from '../../../repositories/teachers-repository';
import { UsersService } from '../../../services/users-service';
import { SiteMember } from '../../../types/wix-types';
import { GeneratePassword } from '../../operations/generate-password';
import { registerTeacherFactory } from './register-teacher';

describe('registerTeacher', () => {
  const registrationResult = buildRegistrationResult({ id: 'user' });
  const user = registrationResult.user;
  const registeredSiteMember = buildSiteMember({ id: user.id });
  const teacher = buildTeacher({ id: 'teacher-id', without: ['siteMemberId'] });
  const password = 'teacher-password';
  const registeredTeacher: Teacher = { ...teacher, siteMemberId: user.id };

  const getSiteMembersService = (
    registeredSiteMember: SiteMember,
    existingSiteMember?: SiteMember
  ) =>
    createStubInstance(SiteMembersRepository, (stub) => {
      stub.fetchMemberByEmail
        .onFirstCall()
        .resolves(existingSiteMember)
        .onSecondCall()
        .resolves(registeredSiteMember);
    });
  const getUsersService = () =>
    createStubInstance(UsersService, (stub) => {
      stub.registerUser.resolves(registrationResult);
    });
  const getTeachersRepository = () =>
    createStubInstance(TeachersRepository, (stub) => {
      stub.updateTeacher.resolves(registeredTeacher);
    });
  const getGeneratePassword = (password: string) => stubFn<GeneratePassword>().resolves(password);

  const buildTestContext = ({
    siteMembersRepository = getSiteMembersService(registeredSiteMember),
    usersService = getUsersService(),
    teachersRepository = getTeachersRepository(),
    generatePassword = getGeneratePassword(password),
  } = {}) => ({
    siteMembersRepository,
    usersService,
    teachersRepository,
    generatePassword,
    registerTeacher: registerTeacherFactory(
      siteMembersRepository,
      usersService,
      teachersRepository,
      generatePassword
    ),
  });

  it('should register teacher, update teacher info and return member', async () => {
    const {
      usersService,
      siteMembersRepository,
      teachersRepository,
      generatePassword,
      registerTeacher,
    } = buildTestContext();
    expect(await registerTeacher(teacher)).to.eql(registeredSiteMember);
    expect(generatePassword).calledOnceWithExactly(teacher._id);
    expect(usersService.registerUser).calledOnceWithExactly(teacher, password);
    expect(teachersRepository.updateTeacher).calledOnceWithExactly(registeredTeacher);
    expect(siteMembersRepository.fetchMemberByEmail).calledTwice;
    expect(siteMembersRepository.fetchMemberByEmail.args).to.eql([
      [teacher.email],
      [teacher.email],
    ]);
  });

  context('for registered member', () => {
    const existingSiteMember = buildSiteMember({ id: 'member' });

    it('should return the member', async () => {
      const {
        usersService,
        siteMembersRepository,
        teachersRepository,
        registerTeacher,
      } = buildTestContext({
        siteMembersRepository: getSiteMembersService(registeredSiteMember, existingSiteMember),
      });
      expect(await registerTeacher(teacher)).to.eql(existingSiteMember);
      expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
      expect(usersService.registerUser).not.called;
      expect(teachersRepository.updateTeacher).not.called;
    });
  });
});
