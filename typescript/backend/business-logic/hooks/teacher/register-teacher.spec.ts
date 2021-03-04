import { buildSiteMember } from '../../../../test/builders/site-member';
import { buildTeacher } from '../../../../test/builders/teacher';
import { expect } from '../../../../test/utils/expectations';
import { stubFn, stubType } from '../../../../test/utils/stubbing';
import { MemberStatus } from '../../../common/common-wix-types';
import { SiteMembersRepository } from '../../../repositories/site-members-repository';
import { UsersService } from '../../../services/users-service';
import { SiteMember } from '../../../types/wix-types';
import { IdProvider } from '../../../utils/id';
import { registerTeacherFactory } from './register-teacher';

describe('registerTeacher', () => {
  const teacher = buildTeacher({ id: 'teacher-id', without: ['siteMemberId'] });
  const generated = 'a76d945a-ffbc-4945-83fa-1c61525a2383';
  const password = 'a76d945affbc';

  const getSiteMembersRepository = (siteMember?: SiteMember) =>
    stubType<SiteMembersRepository>((stub) => {
      stub.fetchMemberByEmail.resolves(siteMember);
    });
  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.registerUser.resolves();
    });
  const getGeneratePassword = (password: string) => stubFn<IdProvider>().returns(password);

  const buildTestContext = ({
    siteMembersRepository = getSiteMembersRepository(),
    usersService = getUsersService(),
    generatePassword = getGeneratePassword(password),
  } = {}) => ({
    siteMembersRepository,
    usersService,
    generatePassword,
    registerTeacher: registerTeacherFactory(siteMembersRepository, usersService, generatePassword),
  });

  it('should register teacher', async () => {
    const {
      usersService,
      siteMembersRepository,
      generatePassword,
      registerTeacher,
    } = buildTestContext();
    expect(await registerTeacher(teacher)).to.eql(teacher);
    expect(generatePassword).calledOnceWithExactly();
    expect(usersService.registerUser).calledOnceWithExactly(teacher, password);
    expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
  });

  context('for existing siteMember', () => {
    const siteMember = buildSiteMember();

    it('should do nothing', async () => {
      const {
        usersService,
        siteMembersRepository,
        generatePassword,
        registerTeacher,
      } = buildTestContext({
        siteMembersRepository: getSiteMembersRepository(siteMember),
      });
      expect(await registerTeacher(teacher)).to.eql(teacher);
      expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
      expect(generatePassword).not.called;
      expect(usersService.registerUser).not.called;
    });

    context('on member pending approval', () => {
      const siteMember = buildSiteMember({
        properties: {
          status: MemberStatus.Applicant,
        },
      });

      it('should approve it', async () => {
        const {
          usersService,
          siteMembersRepository,
          generatePassword,
          registerTeacher,
        } = buildTestContext({ siteMembersRepository: getSiteMembersRepository(siteMember) });
        expect(await registerTeacher(teacher)).to.eql(teacher);
        expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
        expect(generatePassword).not.called;
        expect(usersService.approveUser).calledOnceWithExactly(teacher);
      });
    });
  });
});
