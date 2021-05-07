import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { UsersService } from '../../services/users-service';
import { MakeTeacherView } from '../hooks/make-teacher-view';
import { getCurrentTeacherFactory } from './get-current-teacher';

describe('getCurrentTeacher', () => {
  const email = 'user-email';
  const teacher = buildTeacher({
    properties: { email },
  });
  const returnPrivateFields = true;

  const getTeachersRepository = (teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.fetchTeacherByEmailOrThrow.resolves(teacher);
    });
  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.getCurrentUserEmail.resolves(email);
    });
  const getMakeTeacherView = () => stubFn<MakeTeacherView>().resolves(teacher);
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(teacher),
    usersService = getUsersService(),
    makeTeacherView = getMakeTeacherView(),
  } = {}) => ({
    teachersRepository,
    usersService,
    makeTeacherView,
    getCurrentTeacher: getCurrentTeacherFactory(teachersRepository, usersService, makeTeacherView),
  });

  it('should return current teacher', async () => {
    const {
      teachersRepository,
      usersService,
      makeTeacherView,
      getCurrentTeacher,
    } = buildTestContext();
    expect(await getCurrentTeacher()).to.eql(teacher);
    expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
    expect(teachersRepository.fetchTeacherByEmailOrThrow).calledOnceWithExactly(
      email,
      returnPrivateFields
    );
    expect(makeTeacherView).calledOnceWithExactly(teacher, { returnPrivateFields });
  });
});
