import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance } from '../../../test/utils/stubbing';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { UsersService } from '../../services/users-service';
import { getTeachersProfileFactory } from './get-teachers-profile';

describe('getTeachersProfile', () => {
  const email = 'user-email';
  const teachersProfile = buildTeachersProfile({
    properties: { email },
  });

  const getTeachersProfileRepository = (teachersProfile) =>
    createStubInstance(TeachersProfileRepository, (stub) => {
      stub.fetchTeachersProfileByEmail.resolves(teachersProfile);
    });
  const getUsersService = () =>
    createStubInstance(UsersService, (stub) => {
      stub.getCurrentUserEmail.resolves(email);
    });
  const buildTestContext = ({
    teachersProfileRepository = getTeachersProfileRepository(teachersProfile),
    usersService = getUsersService(),
  } = {}) => ({
    teachersProfileRepository,
    usersService,
    getTeachersProfile: getTeachersProfileFactory(teachersProfileRepository, usersService),
  });

  it('should return current teacher profile', async () => {
    const { teachersProfileRepository, usersService, getTeachersProfile } = buildTestContext();
    expect(await getTeachersProfile()).to.eql(teachersProfile);
    expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
    expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
  });

  context('on profile not existing', () => {
    const teachersProfile = undefined;

    it('should return undefined', async () => {
      const { teachersProfileRepository, getTeachersProfile } = buildTestContext({
        teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
      });
      expect(await getTeachersProfile()).to.be.undefined;
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
    });
  });

  context('on email provided', () => {
    const email = teachersProfile.email;

    it('should return teacher by email', async () => {
      const { teachersProfileRepository, usersService, getTeachersProfile } = buildTestContext();
      expect(await getTeachersProfile(email)).to.eql(teachersProfile);
      expect(usersService.getCurrentUserEmail).not.called;
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
    });
  });
});
