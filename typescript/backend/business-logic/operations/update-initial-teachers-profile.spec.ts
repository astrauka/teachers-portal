import { pick } from 'lodash';
import { buildCountry } from '../../../test/builders/country';
import { buildLanguage } from '../../../test/builders/language';
import { buildRegisteredTeachersInfo } from '../../../test/builders/teachers-info';
import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { TaskNumber } from '../../common/entities/task';
import { RegisteredTeachersInfo } from '../../common/entities/teachers-info';
import { InitialTeacherForm, TeachersProfile } from '../../common/entities/teachers-profile';
import { CountryRepository } from '../../repositories/country-repository';
import { LanguageRepository } from '../../repositories/language-repository';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { InvalidRequestError } from '../../utils/errors';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetCurrentTeachersInfo } from './get-current-teachers-info';
import {
  TEACHERS_PROFILE_DEFAULTS,
  updateInitialTeachersProfileFactory,
} from './update-initial-teachers-profile';

describe('updateInitialTeachersProfile', () => {
  const country = buildCountry();
  const language = buildLanguage();
  const teachersInfo = buildRegisteredTeachersInfo({
    properties: { firstName: 'John', lastName: 'Doe' },
  });
  const fullName = `${teachersInfo.firstName} ${teachersInfo.lastName}`;
  const slug = 'john-doe';

  const teachersProfile = buildTeachersProfile({
    properties: { email: teachersInfo.email, fullName, slug },
  });
  const update: InitialTeacherForm = {
    ...pick(buildTeachersProfile(), ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
    country: country.title,
    language: language.title,
  };
  const updatedTeachersProfile: TeachersProfile = {
    ...teachersProfile,
    ...pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
    countryId: country._id,
    languageId: language._id,
  };

  const getTeachersProfileRepository = (
    teachersProfile: TeachersProfile,
    returnedTeachersProfile: TeachersProfile
  ) =>
    createStubInstance(TeachersProfileRepository, (stub) => {
      stub.fetchTeachersProfileByEmail.resolves(teachersProfile);
      stub.updateTeachersProfile.resolves(returnedTeachersProfile);
      stub.insertTeachersProfile.resolves(returnedTeachersProfile);
    });
  const getCountryRepository = (country) =>
    createStubInstance(CountryRepository, (stub) => {
      stub.fetchCountryByTitleOrThrow.resolves(country);
    });
  const getLanguageRepository = (language) =>
    createStubInstance(LanguageRepository, (stub) => {
      stub.fetchLanguageByTitleOrThrow.resolves(language);
    });
  const getGetCurrentTeachersInfo = (teachersInfo: RegisteredTeachersInfo) =>
    stubFn<GetCurrentTeachersInfo>().resolves(teachersInfo);
  const getCompleteTeachersTask = () => stubFn<CompleteTeachersTask>().resolves();
  const buildTestContext = ({
    teachersProfileRepository = getTeachersProfileRepository(
      teachersProfile,
      updatedTeachersProfile
    ),
    countryRepository = getCountryRepository(country),
    languageRepository = getLanguageRepository(language),
    getCurrentTeachersInfo = getGetCurrentTeachersInfo(teachersInfo),
    completeTeachersTask = getCompleteTeachersTask(),
  } = {}) => ({
    teachersProfileRepository,
    languageRepository,
    getCurrentTeachersInfo,
    completeTeachersTask,
    updateInitialTeachersProfile: updateInitialTeachersProfileFactory(
      teachersProfileRepository,
      countryRepository,
      languageRepository,
      getCurrentTeachersInfo,
      completeTeachersTask
    ),
  });

  it('should update, return current teacher profile and complete task', async () => {
    const {
      teachersProfileRepository,
      languageRepository,
      getCurrentTeachersInfo,
      completeTeachersTask,
      updateInitialTeachersProfile,
    } = buildTestContext();

    expect(await updateInitialTeachersProfile(update)).to.eql(updatedTeachersProfile);
    expect(getCurrentTeachersInfo).calledOnceWithExactly();
    expect(languageRepository.fetchLanguageByTitleOrThrow).calledOnceWithExactly(language.title);
    expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(
      teachersInfo.email
    );
    expect(teachersProfileRepository.updateTeachersProfile).calledOnceWithExactly(
      updatedTeachersProfile
    );
    expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.initialProfileForm);
  });

  context('on profile not existing', () => {
    const teachersProfile = undefined;
    const teachersProfileInsert: Partial<TeachersProfile> = {
      ...pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
      ...pick(teachersInfo, ['email', 'levelId', 'statusId']),
      countryId: country._id,
      languageId: language._id,
      fullName,
      teachersInfoId: teachersInfo._id,
      ...TEACHERS_PROFILE_DEFAULTS,
    };
    const createdTeachersProfile: TeachersProfile = {
      ...(pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']) as Pick<
        TeachersProfile,
        'profileImage' | 'phoneNumber' | 'city' | 'streetAddress'
      >),
      ...pick(teachersInfo, ['email', 'levelId', 'statusId']),
      countryId: country._id,
      languageId: language._id,
      fullName,
      slug,
      teachersInfoId: teachersInfo._id,
      ...TEACHERS_PROFILE_DEFAULTS,
    };

    it('should create a new teachers profile and complete task', async () => {
      const {
        teachersProfileRepository,
        updateInitialTeachersProfile,
        completeTeachersTask,
      } = buildTestContext({
        teachersProfileRepository: getTeachersProfileRepository(
          teachersProfile,
          createdTeachersProfile
        ),
      });
      expect(await updateInitialTeachersProfile(update)).to.eql(createdTeachersProfile);
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(
        teachersInfo.email
      );
      expect(teachersProfileRepository.insertTeachersProfile).calledOnceWithExactly(
        teachersProfileInsert
      );
      expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.initialProfileForm);
    });

    context('on update validation failed', () => {
      const update = { phoneNumber: '11', city: 'a' } as InitialTeacherForm;

      it('should return human readable error', async () => {
        const { teachersProfileRepository, updateInitialTeachersProfile } = buildTestContext();
        await expect(updateInitialTeachersProfile(update)).rejectedWith(/field is required/);
        expect(teachersProfileRepository.fetchTeachersProfileByEmail).not.called;
      });
    });

    context('on insert failed', () => {
      const error = new InvalidRequestError();
      const getTeachersProfileRepository = (teachersProfile) =>
        createStubInstance(TeachersProfileRepository, (stub) => {
          stub.fetchTeachersProfileByEmail.resolves(teachersProfile);
          stub.insertTeachersProfile.rejects(error);
        });

      it('should throw', async () => {
        const { teachersProfileRepository, updateInitialTeachersProfile } = buildTestContext({
          teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
        });
        await expect(updateInitialTeachersProfile(update)).rejectedWith(error);
        expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(
          teachersInfo.email
        );
      });
    });
  });
});
