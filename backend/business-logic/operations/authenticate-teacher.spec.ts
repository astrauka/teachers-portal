import { buildGoogleUser } from '../../../test/builders/google-user';
import { buildTeachersInfo } from '../../../test/builders/teachers-info';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { GoogleAuthService } from '../../services/google-auth-service';
import { UsersService } from '../../services/users-service';
import { authenticateTeacherFactory } from './authenticate-teacher';
import { GeneratePassword } from './generate-password';

describe('authenticateTeacher', () => {
  const idToken = 'google-auth-token';
  const googleUser = buildGoogleUser();
  const signInToken = 'sign-in-token';
  const teachersInfo = buildTeachersInfo({ id: 'teacher-id' });
  const password = 'teacher-password';

  const getGoogleAuthService = () =>
    createStubInstance(GoogleAuthService, (stub) => {
      stub.verifyGoogleToken.resolves(googleUser);
    });
  const getUsersService = () =>
    createStubInstance(UsersService, (stub) => {
      stub.signInTeacher.resolves(signInToken);
    });
  const getTeachersService = (teachersInfo) =>
    createStubInstance(TeachersInfoRepository, (stub) => {
      stub.fetchTeacherByEmailSafe.resolves(teachersInfo);
    });
  const getGeneratePassword = (password: string) => stubFn<GeneratePassword>().resolves(password);
  const buildTestContext = ({
    googleAuthService = getGoogleAuthService(),
    usersService = getUsersService(),
    teachersInfoRepository = getTeachersService(teachersInfo),
    generatePassword = getGeneratePassword(password),
  } = {}) => ({
    googleAuthService,
    usersService,
    teachersInfoRepository,
    generatePassword,
    authenticateTeacher: authenticateTeacherFactory(
      googleAuthService,
      teachersInfoRepository,
      usersService,
      generatePassword
    ),
  });

  it('should register teacher, update teacher info and return member', async () => {
    const {
      googleAuthService,
      usersService,
      teachersInfoRepository,
      generatePassword,
      authenticateTeacher,
    } = buildTestContext();
    expect(await authenticateTeacher(idToken)).to.eql(signInToken);
    expect(googleAuthService.verifyGoogleToken).calledOnceWithExactly(idToken);
    expect(teachersInfoRepository.fetchTeacherByEmailSafe).calledOnceWithExactly(googleUser.email);
    expect(generatePassword).calledOnceWithExactly(teachersInfo._id);
    expect(usersService.signInTeacher).calledOnceWithExactly(teachersInfo, password);
  });

  context('on not a teacher', () => {
    const teachersInfo = undefined;

    it('should throw', async () => {
      const { usersService, authenticateTeacher } = buildTestContext({
        teachersInfoRepository: getTeachersService(teachersInfo),
      });
      await expect(authenticateTeacher(idToken)).rejectedWith(/Invalid email/);
      expect(usersService.signInTeacher).not.called;
    });
  });

  context('on invalid auth token', () => {
    const error = new Error('Invalid token');
    const getGoogleAuthService = () =>
      createStubInstance(GoogleAuthService, (stub) => {
        stub.verifyGoogleToken.rejects(error);
      });

    it('should throw', async () => {
      const { usersService, authenticateTeacher } = buildTestContext({
        googleAuthService: getGoogleAuthService(),
      });
      await expect(authenticateTeacher(idToken)).rejectedWith(error);
      expect(usersService.signInTeacher).not.called;
    });
  });
});
