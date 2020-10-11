import { buildCountry } from '../../test/builders/country';
import { buildLanguage } from '../../test/builders/language';
import { buildTeachersProfile } from '../../test/builders/teachers-profile';
import { expect } from '../../test/utils/expectations';
import { createStubInstance } from '../../test/utils/stubbing';
import { CountryRepository } from '../repositories/country-repository';
import { LanguageRepository } from '../repositories/language-repository';
import { TeachersProfileRepository } from '../repositories/teachers-profile-repository';
import { UsersService } from '../services/users-service';
import { TeachersProfileView } from '../types/teachers-profile';
import { getTeachersProfileFactory } from './get-teachers-profile';

describe('getTeachersProfile', () => {
  const email = 'user-email';
  const country = buildCountry({ id: 'country-id' });
  const language = buildLanguage({ id: 'language-id' });
  const teachersProfile = buildTeachersProfile({
    properties: { email, countryId: country._id, languageId: language._id },
  });
  const teachersProfileView: TeachersProfileView = {
    ...teachersProfile,
    country: country.title,
    language: language.title,
  };

  const getCountryRepository = (country) =>
    createStubInstance(CountryRepository, (stub) => {
      stub.fetchCountryById.resolves(country);
    });
  const getLanguageRepository = (language) =>
    createStubInstance(LanguageRepository, (stub) => {
      stub.fetchLanguageById.resolves(language);
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
    countryRepository = getCountryRepository(country),
    languageRepository = getLanguageRepository(language),
    teachersProfileRepository = getTeachersProfileRepository(teachersProfile),
    usersService = getUsersService(),
  } = {}) => ({
    countryRepository,
    languageRepository,
    teachersProfileRepository,
    usersService,
    getTeachersProfile: getTeachersProfileFactory(
      countryRepository,
      languageRepository,
      teachersProfileRepository,
      usersService
    ),
  });

  it('should return current teacher profile', async () => {
    const {
      teachersProfileRepository,
      usersService,
      countryRepository,
      languageRepository,
      getTeachersProfile,
    } = buildTestContext();
    expect(await getTeachersProfile()).to.eql(teachersProfileView);
    expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
    expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
    expect(countryRepository.fetchCountryById).calledOnceWithExactly(teachersProfile.countryId);
    expect(languageRepository.fetchLanguageById).calledOnceWithExactly(teachersProfile.languageId);
  });

  context('on profile not existing', () => {
    const teachersProfile = undefined;

    it('should return undefined', async () => {
      const {
        teachersProfileRepository,
        countryRepository,
        languageRepository,
        getTeachersProfile,
      } = buildTestContext({
        teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
      });
      expect(await getTeachersProfile()).to.be.undefined;
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
      expect(countryRepository.fetchCountryById).not.called;
      expect(languageRepository.fetchLanguageById).not.called;
    });
  });

  context('on email provided', () => {
    const email = teachersProfile.email;

    it('should return teacher by email', async () => {
      const { teachersProfileRepository, usersService, getTeachersProfile } = buildTestContext();
      expect(await getTeachersProfile(email)).to.eql(teachersProfileView);
      expect(usersService.getCurrentUserEmail).not.called;
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
    });
  });

  context('on country and language not selected', () => {
    const teachersProfile = buildTeachersProfile({ without: ['countryId', 'languageId'] });
    const teachersProfileView = { ...teachersProfile, country: undefined, language: undefined };

    it('should return no titles', async () => {
      const {
        teachersProfileRepository,
        usersService,
        countryRepository,
        languageRepository,
        getTeachersProfile,
      } = buildTestContext({
        teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
      });
      expect(await getTeachersProfile()).to.eql(teachersProfileView);
      expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
      expect(countryRepository.fetchCountryById).not.called;
      expect(languageRepository.fetchLanguageById).not.called;
    });
  });

  context('on country and language not existing', () => {
    const country = undefined;
    const language = undefined;
    const teachersProfileView = { ...teachersProfile, country: undefined, language: undefined };

    it('should return no titles', async () => {
      const {
        teachersProfileRepository,
        usersService,
        countryRepository,
        languageRepository,
        getTeachersProfile,
      } = buildTestContext({
        countryRepository: getCountryRepository(country),
        languageRepository: getLanguageRepository(language),
      });
      expect(await getTeachersProfile()).to.eql(teachersProfileView);
      expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
      expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(email);
      expect(countryRepository.fetchCountryById).calledOnceWithExactly(teachersProfile.countryId);
      expect(languageRepository.fetchLanguageById).calledOnceWithExactly(
        teachersProfile.languageId
      );
    });
  });
});
