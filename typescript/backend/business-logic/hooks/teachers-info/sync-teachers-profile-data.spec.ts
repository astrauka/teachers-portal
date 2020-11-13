import { buildHookContext } from '../../../../test/builders/hooks';
import { buildRegisteredTeachersInfo } from '../../../../test/builders/teachers-info';
import { buildTeachersProfile } from '../../../../test/builders/teachers-profile';
import { expect } from '../../../../test/utils/expectations';
import { createStubInstance } from '../../../../test/utils/stubbing';
import { RegisteredTeachersInfo } from '../../../common/entities/teachers-info';
import { TeachersProfile } from '../../../common/entities/teachers-profile';
import { TEACHERS_INFO_COLLECTION } from '../../../repositories/teachers-info-repository';
import { TeachersProfileRepository } from '../../../repositories/teachers-profile-repository';
import { syncTeachersProfileDataFactory } from './sync-teachers-profile-data';

describe('syncTeachersProfileData', () => {
  const previousTeachersInfo = buildRegisteredTeachersInfo();
  const hookContext = buildHookContext<RegisteredTeachersInfo>(
    TEACHERS_INFO_COLLECTION,
    previousTeachersInfo
  );
  const teachersInfo = buildRegisteredTeachersInfo({
    id: previousTeachersInfo._id,
    properties: { firstName: 'new-first-name' },
  });
  const teachersProfile = buildTeachersProfile({
    properties: {
      teachersInfoId: teachersInfo._id,
    },
  });
  const updatedTeachersProfile = buildTeachersProfile({
    id: teachersProfile._id,
    properties: {
      email: teachersInfo.email,
      fullName: `${teachersInfo.firstName} ${teachersInfo.lastName}`,
      levelId: teachersInfo.levelId,
      statusId: teachersInfo.statusId,
      teachersInfoId: teachersInfo._id,
    },
  });
  const getTeachersProfileRepository = (
    teachersProfile: TeachersProfile,
    returnedTeachersProfile: TeachersProfile
  ) =>
    createStubInstance(TeachersProfileRepository, (stub) => {
      stub.fetchTeachersProfileByTeachersInfoId.resolves(teachersProfile);
      stub.updateTeachersProfile.resolves(returnedTeachersProfile);
    });
  const buildTestContext = ({
    teachersProfileRepository = getTeachersProfileRepository(
      teachersProfile,
      updatedTeachersProfile
    ),
  } = {}) => ({
    teachersProfileRepository,
    syncTeachersProfileData: syncTeachersProfileDataFactory(teachersProfileRepository),
  });

  it('should copy fields to teachersProfile', async () => {
    const { teachersProfileRepository, syncTeachersProfileData } = buildTestContext();
    expect(await syncTeachersProfileData(teachersInfo, hookContext)).to.eql(teachersInfo);
    expect(teachersProfileRepository.fetchTeachersProfileByTeachersInfoId).calledOnceWithExactly(
      teachersInfo._id
    );
    expect(teachersProfileRepository.updateTeachersProfile).calledOnceWithExactly(
      updatedTeachersProfile
    );
  });

  context('on no copied fields updated', () => {
    const teachersInfo = buildRegisteredTeachersInfo({
      id: previousTeachersInfo._id,
    });

    it('should do nothing', async () => {
      const { teachersProfileRepository, syncTeachersProfileData } = buildTestContext();
      expect(await syncTeachersProfileData(teachersInfo, hookContext)).to.eql(teachersInfo);
      expect(teachersProfileRepository.fetchTeachersProfileByTeachersInfoId).not.called;
      expect(teachersProfileRepository.updateTeachersProfile).not.called;
    });
  });

  context('on teachersProfile not created', () => {
    const teachersProfile = undefined;

    it('should do nothing', async () => {
      const { teachersProfileRepository, syncTeachersProfileData } = buildTestContext({
        teachersProfileRepository: getTeachersProfileRepository(teachersProfile, undefined),
      });
      expect(await syncTeachersProfileData(teachersInfo, hookContext)).to.eql(teachersInfo);
      expect(teachersProfileRepository.fetchTeachersProfileByTeachersInfoId).calledOnceWithExactly(
        teachersInfo._id
      );
      expect(teachersProfileRepository.updateTeachersProfile).not.called;
    });
  });
});
