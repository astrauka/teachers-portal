import { RegisteredTeachersInfo } from '../../../common/types/teachers-info';
import { TeachersProfile } from '../../../common/types/teachers-profile';
import { buildRegisteredTeachersInfo } from '../../../test/builders/teachers-info';
import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { getCuratingTeachersProfileFactory } from './get-curating-teachers-profile';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';
import { GetTeachersProfile } from './get-teachers-profile';

describe('getCuratingTeachersProfile', () => {
  const curatingTeachersInfo = buildRegisteredTeachersInfo({ id: 'curating' });
  const currentTeachersInfo = buildRegisteredTeachersInfo({
    id: 'current',
    properties: { mentorId: curatingTeachersInfo._id },
  });
  const curatingTeachersProfile = buildTeachersProfile({
    id: 'curating',
    properties: { email: curatingTeachersInfo.email },
  });

  const getGetCurrentTeachersInfo = (teachersInfo: RegisteredTeachersInfo) =>
    stubFn<GetCurrentTeachersInfo>().resolves(teachersInfo);
  const getTeachersInfoRepository = (teachersInfo: RegisteredTeachersInfo) =>
    createStubInstance(TeachersInfoRepository, (stub) => {
      stub.fetchTeacherById.resolves(teachersInfo);
    });
  const getGetTeachersProfile = (teachersProfile: TeachersProfile) =>
    stubFn<GetTeachersProfile>().resolves(teachersProfile);
  const buildTestContext = ({
    getCurrentTeachersInfo = getGetCurrentTeachersInfo(currentTeachersInfo),
    getTeachersProfile = getGetTeachersProfile(curatingTeachersProfile),
    teachersInfoRepository = getTeachersInfoRepository(curatingTeachersInfo),
  } = {}) => ({
    getCurrentTeachersInfo,
    getTeachersProfile,
    teachersInfoRepository,
    getCuratingTeachersProfile: getCuratingTeachersProfileFactory(
      getCurrentTeachersInfo,
      getTeachersProfile,
      teachersInfoRepository
    ),
  });

  it('should return curating teacher profile', async () => {
    const {
      getCurrentTeachersInfo,
      getTeachersProfile,
      teachersInfoRepository,
      getCuratingTeachersProfile,
    } = buildTestContext();
    expect(await getCuratingTeachersProfile()).to.eql(curatingTeachersProfile);
    expect(teachersInfoRepository.fetchTeacherById).calledOnceWithExactly(
      currentTeachersInfo.mentorId
    );
    expect(getCurrentTeachersInfo).calledOnceWithExactly();
    expect(getTeachersProfile).calledOnceWithExactly(curatingTeachersInfo.email);
  });

  context('for teacher without mentor', () => {
    const currentTeachersInfo = buildRegisteredTeachersInfo({ without: ['mentorId'] });

    it('should return undefined', async () => {
      const {
        getCurrentTeachersInfo,
        getTeachersProfile,
        teachersInfoRepository,
        getCuratingTeachersProfile,
      } = buildTestContext({
        getCurrentTeachersInfo: getGetCurrentTeachersInfo(currentTeachersInfo),
      });
      expect(await getCuratingTeachersProfile()).to.be.undefined;
      expect(teachersInfoRepository.fetchTeacherById).not.called;
      expect(getCurrentTeachersInfo).calledOnceWithExactly();
      expect(getTeachersProfile).not.called;
    });
  });

  context('on mentor deleted', () => {
    const curatingTeachersInfo = undefined;

    it('should return undefined', async () => {
      const { getTeachersProfile, getCuratingTeachersProfile } = buildTestContext({
        teachersInfoRepository: getTeachersInfoRepository(curatingTeachersInfo),
      });
      expect(await getCuratingTeachersProfile()).to.be.undefined;
      expect(getTeachersProfile).not.called;
    });
  });
});
