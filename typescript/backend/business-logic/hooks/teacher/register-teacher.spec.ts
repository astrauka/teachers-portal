import { buildSiteMember } from '../../../../test/builders/site-member';
import { buildTeacher } from '../../../../test/builders/teacher';
import { expect } from '../../../../test/utils/expectations';
import { stubFn, stubType } from '../../../../test/utils/stubbing';
import { SiteMembersRepository } from '../../../repositories/site-members-repository';
import { UsersService } from '../../../services/users-service';
import { SiteMember } from '../../../types/wix-types';
import { GeneratePassword } from '../../operations/generate-password';
import { registerTeacherFactory } from './register-teacher';

describe('registerTeacher', () => {
  const teacher = buildTeacher({ id: 'teacher-id', without: ['siteMemberId'] });
  const password = 'teacher-password';

  const getSiteMembersService = (siteMember?: SiteMember) =>
    stubType<SiteMembersRepository>((stub) => {
      stub.fetchMemberByEmail.resolves(siteMember);
    });
  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.registerUser.resolves();
    });
  const getGeneratePassword = (password: string) => stubFn<GeneratePassword>().resolves(password);

  const buildTestContext = ({
    siteMembersRepository = getSiteMembersService(),
    usersService = getUsersService(),
    generatePassword = getGeneratePassword(password),
  } = {}) => ({
    siteMembersRepository,
    usersService,
    generatePassword,
    registerTeacher: registerTeacherFactory(siteMembersRepository, usersService, generatePassword),
  });

  it('should register teacher, update teacher info and return member', async () => {
    const {
      usersService,
      siteMembersRepository,
      generatePassword,
      registerTeacher,
    } = buildTestContext();
    expect(await registerTeacher(teacher)).to.eql(teacher);
    expect(generatePassword).calledOnceWithExactly(teacher.email);
    expect(usersService.registerUser).calledOnceWithExactly(teacher, password);
    expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
  });

  context('for existing siteMember', () => {
    const siteMember = buildSiteMember({ id: 'member' });

    it('should return the member', async () => {
      const {
        usersService,
        siteMembersRepository,
        generatePassword,
        registerTeacher,
      } = buildTestContext({
        siteMembersRepository: getSiteMembersService(siteMember),
      });
      expect(await registerTeacher(teacher)).to.eql(teacher);
      expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
      expect(generatePassword).not.called;
      expect(usersService.registerUser).not.called;
    });
  });
});
