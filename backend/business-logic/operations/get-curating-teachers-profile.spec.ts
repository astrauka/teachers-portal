import { buildRegisteredTeachersInfo } from '../../../test/builders/teachers-info';
import { buildTeachersProfileView } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { RegisteredTeachersInfo } from '../../types/teachers-info';
import { getCuratingTeachersProfileFactory } from './get-curating-teachers-profile';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';

describe('getCuratingTeachersProfile', () => {
  const curatingTeachersInfo = buildRegisteredTeachersInfo({ id: 'curating' });
  const currentTeachersInfo = buildRegisteredTeachersInfo({
    id: 'current',
    properties: { mentorId: curatingTeachersInfo._id },
  });
  const curatingTeachersProfileView = buildTeachersProfileView();

  const getGetCurrentTeachersInfo = (teachersInfo: RegisteredTeachersInfo) =>
    stubFn<GetCurrentTeachersInfo>().resolves(teachersInfo);
  const getTeachersInfoRepository = (teachersInfo: RegisteredTeachersInfo) =>
    createStubInstance(TeachersInfoRepository, (stub) => {
      stub.fetchTeacherByEmailSafe.resolves(curatingTeachersInfo);
    });
  const buildTestContext = ({
    getCurrentTeachersInfo = getGetCurrentTeachersInfo(currentTeachersInfo),
    teachersInfoRepository = getTeachersInfoRepository(curatingTeachersInfo),
  } = {}) => ({
    getCurrentTeachersInfo,
    teachersInfoRepository,
    getCuratingTeachersProfile: getCuratingTeachersProfileFactory(
      getCurrentTeachersInfo,
      teachersInfoRepository
    ),
  });

  it('should return curating teacher profile', async () => {
    const { teachersInfoRepository, getCuratingTeachersProfile } = buildTestContext();
    expect(await getCuratingTeachersProfile()).to.eql(curatingTeachersProfileView);
    expect(teachersInfoRepository.fetchTeacherById).calledOnceWithExactly(
      currentTeachersInfo.mentorId
    );
  });
  //
  // context('on profile not existing', () => {
  //   const teachersInfo = undefined;
  //
  //   it('should return undefined', async () => {
  //     const {
  //       teachersInfoRepository,
  //       countryRepository,
  //       languageRepository,
  //       getCuratingTeachersProfile,
  //     } = buildTestContext({
  //       teachersInfoRepository: getTeachersInfoRepository(teachersInfo),
  //     });
  //     expect(await getCuratingTeachersProfile()).to.be.undefined;
  //     expect(teachersInfoRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
  //     expect(countryRepository.fetchCountryById).not.called;
  //     expect(languageRepository.fetchLanguageById).not.called;
  //   });
  // });
  //
  // context('on email provided', () => {
  //   const email = teachersInfo.email;
  //
  //   it('should return teacher by email', async () => {
  //     const {
  //       teachersInfoRepository,
  //       usersService,
  //       getCuratingTeachersProfile,
  //     } = buildTestContext();
  //     expect(await getCuratingTeachersProfile(email)).to.eql(teachersProfileView);
  //     expect(usersService.getCurrentUserEmail).not.called;
  //     expect(teachersInfoRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
  //   });
  // });
  //
  // context('on country and language not selected', () => {
  //   const teachersInfo = buildTeachersProfile({ without: ['countryId', 'languageId'] });
  //   const teachersProfileView = { ...teachersInfo, country: undefined, language: undefined };
  //
  //   it('should return no titles', async () => {
  //     const {
  //       teachersInfoRepository,
  //       usersService,
  //       countryRepository,
  //       languageRepository,
  //       getCuratingTeachersProfile,
  //     } = buildTestContext({
  //       teachersInfoRepository: getTeachersInfoRepository(teachersInfo),
  //     });
  //     expect(await getCuratingTeachersProfile()).to.eql(teachersProfileView);
  //     expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
  //     expect(teachersInfoRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
  //     expect(countryRepository.fetchCountryById).not.called;
  //     expect(languageRepository.fetchLanguageById).not.called;
  //   });
  // });
  //
  // context('on country and language not existing', () => {
  //   const country = undefined;
  //   const language = undefined;
  //   const teachersProfileView = { ...teachersInfo, country: undefined, language: undefined };
  //
  //   it('should return no titles', async () => {
  //     const {
  //       teachersInfoRepository,
  //       usersService,
  //       countryRepository,
  //       languageRepository,
  //       getCuratingTeachersProfile,
  //     } = buildTestContext({
  //       countryRepository: getCountryRepository(country),
  //       languageRepository: getLanguageRepository(language),
  //     });
  //     expect(await getCuratingTeachersProfile()).to.eql(teachersProfileView);
  //     expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
  //     expect(teachersInfoRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
  //     expect(countryRepository.fetchCountryById).calledOnceWithExactly(teachersInfo.countryId);
  //     expect(languageRepository.fetchLanguageById).calledOnceWithExactly(
  //       teachersInfo.languageId
  //     );
  //   });
  // });
});
