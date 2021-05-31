import { buildSiteMember } from '../../../test/builders/site-member';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { SiteMembersRepository } from '../../repositories/site-members-repository';
import { SecretsService } from '../../services/secrets-service';
import { UsersService } from '../../services/users-service';
import { SiteMember } from '../../types/wix-types';
import { TEST_TEACHER_EMAIL } from '../../universal/entities/test-teacher';
import { MemberStatus } from '../../universal/wix-types';
import { IdProvider } from '../../utils/id';

import { registerTeacherFactory } from './register-teacher';

describe('registerTeacher', () => {
  const teacher = buildTeacher({ id: 'teacher-id' });
  const password = 'a76d945affbc';
  const testTeacherPassword = 'TestTeacherPassword';

  const getSiteMembersRepository = (siteMember?: SiteMember) =>
    stubType<SiteMembersRepository>((stub) => {
      stub.fetchMemberByEmail.resolves(siteMember);
    });
  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.registerUser.resolves();
    });
  const getSecretsService = () =>
    stubType<SecretsService>((stub) => {
      stub.getTestTeacherPassword.resolves(testTeacherPassword);
    });
  const getGeneratePassword = (password: string) => stubFn<IdProvider>().returns(password);

  const buildTestContext = ({
    siteMembersRepository = getSiteMembersRepository(),
    usersService = getUsersService(),
    secretsService = getSecretsService(),
    generatePassword = getGeneratePassword(password),
  } = {}) => ({
    siteMembersRepository,
    usersService,
    secretsService,
    generatePassword,
    registerTeacher: registerTeacherFactory(
      siteMembersRepository,
      usersService,
      secretsService,
      generatePassword
    ),
  });

  it('should register teacher', async () => {
    const {
      usersService,
      secretsService,
      siteMembersRepository,
      generatePassword,
      registerTeacher,
    } = buildTestContext();
    expect(await registerTeacher(teacher)).to.eql(teacher);
    expect(generatePassword).calledOnceWithExactly();
    expect(usersService.registerUser).calledOnceWithExactly(teacher, password);
    expect(secretsService.getTestTeacherPassword).not.called;
    expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
  });

  context('for existing siteMember', () => {
    const siteMember = buildSiteMember();

    it('should do nothing', async () => {
      const { usersService, siteMembersRepository, generatePassword, registerTeacher } =
        buildTestContext({
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
        const { usersService, siteMembersRepository, generatePassword, registerTeacher } =
          buildTestContext({
            siteMembersRepository: getSiteMembersRepository(siteMember),
          });
        expect(await registerTeacher(teacher)).to.eql(teacher);
        expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
        expect(generatePassword).not.called;
        expect(usersService.approveUser).calledOnceWithExactly(teacher);
      });
    });
  });

  context('for test teacher', () => {
    const teacher = buildTeacher({ properties: { email: TEST_TEACHER_EMAIL } });

    it('should use password from secret', async () => {
      const {
        usersService,
        secretsService,
        siteMembersRepository,
        generatePassword,
        registerTeacher,
      } = buildTestContext();
      expect(await registerTeacher(teacher)).to.eql(teacher);
      expect(generatePassword).not.called;
      expect(secretsService.getTestTeacherPassword).calledOnceWithExactly();
      expect(usersService.registerUser).calledOnceWithExactly(teacher, testTeacherPassword);
      expect(siteMembersRepository.fetchMemberByEmail).calledOnceWithExactly(teacher.email);
    });
  });
});
