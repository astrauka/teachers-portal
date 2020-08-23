import { buildRegisteredTeachersInfo } from '../../test/builders/teachers-info';
import { expect } from '../../test/utils/expectations';
import { createStubInstance } from '../../test/utils/stubbing';
import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { UsersService } from '../services/users-service';
import { getCurrentTeachersInfoFactory } from './get-current-teachers-info';

describe('getCurrentTeachersInfo', () => {
  const email = 'user-email';
  const teachersInfo = buildRegisteredTeachersInfo({ properties: { email } });

  const getTeachersInfoRepository = (teachersInfo) =>
    createStubInstance(TeachersInfoRepository, (stub) => {
      stub.fetchTeacherByEmail.resolves(teachersInfo);
    });
  const getUsersService = () =>
    createStubInstance(UsersService, (stub) => {
      stub.getCurrentUserEmail.resolves(email);
    });
  const buildTestContext = ({
    teachersInfoRepository = getTeachersInfoRepository(teachersInfo),
    usersService = getUsersService(),
  } = {}) => ({
    teachersInfoRepository,
    usersService,
    getCurrentTeachersInfo: getCurrentTeachersInfoFactory(teachersInfoRepository, usersService),
  });

  it('should return current teacher info', async () => {
    const { teachersInfoRepository, usersService, getCurrentTeachersInfo } = buildTestContext();
    expect(await getCurrentTeachersInfo()).to.eql(teachersInfo);
    expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
    expect(teachersInfoRepository.fetchTeacherByEmail).calledOnceWithExactly(email);
  });

  context('on info not existing', () => {
    const error = new Error('not found');
    const getTeachersInfoRepository = () =>
      createStubInstance(TeachersInfoRepository, (stub) => {
        stub.fetchTeacherByEmail.rejects(error);
      });

    it('should throw', async () => {
      const { getCurrentTeachersInfo } = buildTestContext({
        teachersInfoRepository: getTeachersInfoRepository(),
      });
      await expect(getCurrentTeachersInfo()).rejectedWith(error);
    });
  });
});
