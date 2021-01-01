import { buildGoogleUser } from '../../../test/builders/google-user';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { GoogleAuthService } from '../../services/google-auth-service';
import { UsersService } from '../../services/users-service';
import { authenticateTeacherFactory } from './authenticate-teacher';
import { GeneratePassword } from './generate-password';

describe('authenticateTeacher', () => {
  const idToken = 'google-auth-token';
  const googleUser = buildGoogleUser();
  const signInToken = 'sign-in-token';
  const teacher = buildTeacher({ id: 'teacher-id' });
  const password = 'teacher-password';

  const getGoogleAuthService = () =>
    stubType<GoogleAuthService>((stub) => {
      stub.verifyGoogleToken.resolves(googleUser);
    });
  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.signInTeacher.resolves(signInToken);
    });
  const getTeachersRepository = (teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.fetchTeacherByEmail.resolves(teacher);
    });
  const getGeneratePassword = (password: string) => stubFn<GeneratePassword>().resolves(password);
  const buildTestContext = ({
    googleAuthService = getGoogleAuthService(),
    usersService = getUsersService(),
    teachersRepository = getTeachersRepository(teacher),
    generatePassword = getGeneratePassword(password),
  } = {}) => ({
    googleAuthService,
    usersService,
    teachersRepository,
    generatePassword,
    authenticateTeacher: authenticateTeacherFactory(
      googleAuthService,
      teachersRepository,
      usersService,
      generatePassword
    ),
  });

  it('should register teacher, update teacher info and return member', async () => {
    const {
      googleAuthService,
      usersService,
      teachersRepository,
      generatePassword,
      authenticateTeacher,
    } = buildTestContext();
    expect(await authenticateTeacher(idToken)).to.eql(signInToken);
    expect(googleAuthService.verifyGoogleToken).calledOnceWithExactly(idToken);
    expect(teachersRepository.fetchTeacherByEmail).calledOnceWithExactly(googleUser.email);
    expect(generatePassword).calledOnceWithExactly(teacher.email);
    expect(usersService.signInTeacher).calledOnceWithExactly(teacher, password);
  });

  context('on not a teacher', () => {
    const teacher = undefined;

    it('should throw', async () => {
      const { usersService, authenticateTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(teacher),
      });
      await expect(authenticateTeacher(idToken)).rejectedWith(/Invalid email/);
      expect(usersService.signInTeacher).not.called;
    });
  });

  context('on invalid auth token', () => {
    const error = new Error('Invalid token');
    const getGoogleAuthService = () =>
      stubType<GoogleAuthService>((stub) => {
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
