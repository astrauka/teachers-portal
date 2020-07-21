import { pick } from 'lodash';
import { buildCountry } from '../../test/builders/country';
import { buildLanguage } from '../../test/builders/language';
import { buildMember } from '../../test/builders/member';
import { buildTeachersProfile } from '../../test/builders/teachers-profile';
import { expect } from '../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../test/utils/stubbing';
import { CountryRepository } from '../repositories/country-repository';
import { LanguageRepository } from '../repositories/language-repository';
import { MembersRepository } from '../repositories/members-repository';
import { TeachersProfileRepository } from '../repositories/teachers-profile-repository';
import { UsersService } from '../services/users-service';
import { TaskNumber } from '../types/task';
import { TeachersProfileUpdate } from '../types/teachers-profile';
import { InvalidRequestError } from '../utils/errors';
import { CompleteTeachersTask } from './complete-teachers-task';
import { updateCurrentTeachersProfileFactory } from './update-current-teachers-profile';

describe('updateCurrentTeachersProfile', () => {
  const email = 'current-user-email@gmail.com';
  const country = buildCountry();
  const language = buildLanguage();
  const member = buildMember({ id: 'current-member', properties: { loginEmail: email } });
  const teachersProfile = buildTeachersProfile({
    properties: { userId: member._id, email },
  });
  const update: TeachersProfileUpdate = {
    ...pick(buildTeachersProfile(), ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
    country: country.title,
    language: language.title,
  };

  const getTeachersProfileRepository = (teachersProfile) =>
    createStubInstance(TeachersProfileRepository, (stub) => {
      stub.fetchTeachersProfileByEmail.resolves(teachersProfile);
      stub.updateTeachersProfile.resolvesArg(0);
      stub.insertTeachersProfile.resolvesArg(0);
    });
  const getUsersService = () =>
    createStubInstance(UsersService, (stub) => {
      stub.getCurrentUserEmail.resolves(email);
    });
  const getMembersService = (member) =>
    createStubInstance(MembersRepository, (stub) => {
      stub.fetchMemberByEmail.resolves(member);
    });
  const getCountryRepository = (country) =>
    createStubInstance(CountryRepository, (stub) => {
      stub.fetchCountryByTitle.resolves(country);
    });
  const getLanguageRepository = (language) =>
    createStubInstance(LanguageRepository, (stub) => {
      stub.fetchLanguageByTitle.resolves(language);
    });
  const getCompleteTeachersTask = () => stubFn<CompleteTeachersTask>().resolves();
  const buildTestContext = ({
    teachersProfileRepository = getTeachersProfileRepository(teachersProfile),
    usersService = getUsersService(),
    membersRepository = getMembersService(member),
    countryRepository = getCountryRepository(country),
    languageRepository = getLanguageRepository(language),
    completeTeachersTask = getCompleteTeachersTask(),
  } = {}) => ({
    teachersProfileRepository,
    usersService,
    countryRepository,
    languageRepository,
    completeTeachersTask,
    updateCurrentTeachersProfile: updateCurrentTeachersProfileFactory(
      teachersProfileRepository,
      usersService,
      membersRepository,
      countryRepository,
      languageRepository,
      completeTeachersTask
    ),
  });

  it('should update, return current teacher profile and complete task', async () => {
    const {
      teachersProfileRepository,
      usersService,
      updateCurrentTeachersProfile,
      countryRepository,
      languageRepository,
      completeTeachersTask,
    } = buildTestContext();
    const updatedTeachersProfile = {
      ...teachersProfile,
      ...pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
      countryId: country._id,
      languageId: language._id,
    };

    expect(await updateCurrentTeachersProfile(update)).to.eql(updatedTeachersProfile);
    expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
    expect(countryRepository.fetchCountryByTitle).calledOnceWithExactly(country.title);
    expect(languageRepository.fetchLanguageByTitle).calledOnceWithExactly(language.title);
    expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
    expect(teachersProfileRepository.updateTeachersProfile).calledOnceWithExactly(
      updatedTeachersProfile
    );
    expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.initialProfileForm);
  });

  context('on profile not existing', () => {
    const teachersProfile = undefined;

    it('should create a new teachers profile and complete task', async () => {
      const {
        teachersProfileRepository,
        updateCurrentTeachersProfile,
        completeTeachersTask,
      } = buildTestContext({
        teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
      });
      const createdTeachersProfile = {
        ...pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
        countryId: country._id,
        languageId: language._id,
        email,
        userId: member._id,
      };
      expect(await updateCurrentTeachersProfile(update)).to.eql(createdTeachersProfile);
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
      expect(teachersProfileRepository.insertTeachersProfile).calledOnceWithExactly(
        createdTeachersProfile
      );
      expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.initialProfileForm);
    });

    context('on update validation failed', () => {
      const update = { phoneNumber: '11', city: 'a' } as TeachersProfileUpdate;

      it('should return human readable error', async () => {
        const { teachersProfileRepository, updateCurrentTeachersProfile } = buildTestContext();
        await expect(updateCurrentTeachersProfile(update)).rejectedWith(/field is required/);
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
        const { teachersProfileRepository, updateCurrentTeachersProfile } = buildTestContext({
          teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
        });
        await expect(updateCurrentTeachersProfile(update)).rejectedWith(error);
        expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
      });
    });
  });
});
