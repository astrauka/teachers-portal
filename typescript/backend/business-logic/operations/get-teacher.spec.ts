import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { UsersService } from '../../services/users-service';
import { getTeacherFactory } from './get-teacher';

describe('getTeacher', () => {
  const email = 'user-email';
  const teacher = buildTeacher({
    properties: { email },
  });

  const getTeachersRepository = (teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.fetchTeacherByEmail.resolves(teacher);
      stub.fetchTeacherByEmailOrThrow.resolves(teacher);
    });
  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.getCurrentUserEmail.resolves(email);
    });
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(teacher),
    usersService = getUsersService(),
  } = {}) => ({
    teachersRepository,
    usersService,
    getTeacher: getTeacherFactory(teachersRepository, usersService),
  });

  it('should return current teacher', async () => {
    const { teachersRepository, usersService, getTeacher } = buildTestContext();
    expect(await getTeacher()).to.eql(teacher);
    expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
    expect(teachersRepository.fetchTeacherByEmail).calledOnceWithExactly(email);
  });

  context('on teacher not existing', () => {
    const teacher = undefined;

    it('should return undefined', async () => {
      const { teachersRepository, getTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(teacher),
      });
      expect(await getTeacher()).to.be.undefined;
      expect(teachersRepository.fetchTeacherByEmail).calledOnceWithExactly(email);
      expect(teachersRepository.fetchTeacherByEmailOrThrow).not.called;
    });
  });

  context('on email provided', () => {
    const email = teacher.email;

    it('should return teacher by email', async () => {
      const { teachersRepository, usersService, getTeacher } = buildTestContext();
      expect(await getTeacher({ email })).to.eql(teacher);
      expect(usersService.getCurrentUserEmail).not.called;
      expect(teachersRepository.fetchTeacherByEmail).calledOnceWithExactly(email);
    });
  });

  context('on throwOnNotFound', () => {
    const throwOnNotFound = true;

    it('should fetch teacher by email or throw', async () => {
      const { teachersRepository, getTeacher } = buildTestContext();
      expect(await getTeacher({ throwOnNotFound })).to.eql(teacher);
      expect(teachersRepository.fetchTeacherByEmailOrThrow).calledOnceWithExactly(email);
      expect(teachersRepository.fetchTeacherByEmail).not.called;
    });
  });
});
