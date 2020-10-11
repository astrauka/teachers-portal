import { buildCountry } from '../../../test/builders/country';
import { buildLanguage } from '../../../test/builders/language';
import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance } from '../../../test/utils/stubbing';
import { CountryRepository } from '../../repositories/country-repository';
import { LanguageRepository } from '../../repositories/language-repository';
import { TeachersProfileView } from '../../types/teachers-profile';
import { makeTeachersProfileViewsFactory } from './make-teachers-profile-view';

describe('makeTeachersProfileViews', () => {
  const country1 = buildCountry({ id: 'country-1' });
  const country2 = buildCountry({ id: 'country-2' });
  const countries = [country2, country1];
  const language1 = buildLanguage({ id: 'language-1' });
  const language2 = buildLanguage({ id: 'language-2' });
  const languages = [language2, language1];
  const teachersProfile1 = buildTeachersProfile({
    id: 'profile-1',
    properties: { countryId: country1._id, languageId: language1._id },
  });
  const teachersProfile2 = buildTeachersProfile({
    id: 'profile-2',
    properties: { countryId: country2._id, languageId: language2._id },
  });
  const teachersProfiles = [teachersProfile1, teachersProfile2];
  const teachersProfileView1: TeachersProfileView = {
    ...teachersProfile1,
    country: country1.title,
    language: language1.title,
  };
  const teachersProfileView2: TeachersProfileView = {
    ...teachersProfile2,
    country: country2.title,
    language: language2.title,
  };
  const teachersProfileViews = [teachersProfileView1, teachersProfileView2];

  const getCountryRepository = (countries) =>
    createStubInstance(CountryRepository, (stub) => {
      stub.fetchCountriesByIds.resolves(countries);
    });
  const getLanguageRepository = (languages) =>
    createStubInstance(LanguageRepository, (stub) => {
      stub.fetchLanguagesByIds.resolves(languages);
    });
  const buildTestContext = ({
    countryRepository = getCountryRepository(countries),
    languageRepository = getLanguageRepository(languages),
  } = {}) => ({
    countryRepository,
    languageRepository,
    makeTeachersProfileViews: makeTeachersProfileViewsFactory(
      countryRepository,
      languageRepository
    ),
  });

  it('should return teachers profile view', async () => {
    const { countryRepository, languageRepository, makeTeachersProfileViews } = buildTestContext();
    expect(await makeTeachersProfileViews(teachersProfiles)).to.eql(teachersProfileViews);
    expect(countryRepository.fetchCountriesByIds).calledOnceWithExactly([
      country1._id,
      country2._id,
    ]);
    expect(languageRepository.fetchLanguagesByIds).calledOnceWithExactly([
      language1._id,
      language2._id,
    ]);
  });

  context('on country and language not selected', () => {
    const teachersProfile1 = buildTeachersProfile({ without: ['countryId', 'languageId'] });
    const teachersProfileView1 = { ...teachersProfile1, country: undefined, language: undefined };

    it('should return no titles', async () => {
      const { countryRepository, languageRepository, makeTeachersProfileViews } = buildTestContext({
        countryRepository: getCountryRepository([country2]),
        languageRepository: getLanguageRepository([language2]),
      });
      expect(await makeTeachersProfileViews([teachersProfile1, teachersProfile2])).to.eql([
        teachersProfileView1,
        teachersProfileView2,
      ]);
      expect(countryRepository.fetchCountriesByIds).calledOnceWithExactly([country2._id]);
      expect(languageRepository.fetchLanguagesByIds).calledOnceWithExactly([language2._id]);
    });
  });

  context('on no teachers profiles', () => {
    const teachersProfiles = [];

    it('should not fetch anything', async () => {
      const {
        countryRepository,
        languageRepository,
        makeTeachersProfileViews,
      } = buildTestContext();
      expect(await makeTeachersProfileViews(teachersProfiles)).to.eql([]);
      expect(countryRepository.fetchCountriesByIds).not.called;
      expect(languageRepository.fetchLanguagesByIds).not.called;
    });
  });

  context('on country and language not existing', () => {
    const countries = [country1];
    const languages = [language1];
    const teachersProfileView2 = { ...teachersProfile2, country: undefined, language: undefined };

    it('should return no titles', async () => {
      const { countryRepository, languageRepository, makeTeachersProfileViews } = buildTestContext({
        countryRepository: getCountryRepository(countries),
        languageRepository: getLanguageRepository(languages),
      });
      expect(await makeTeachersProfileViews(teachersProfiles)).to.eql([
        teachersProfileView1,
        teachersProfileView2,
      ]);
      expect(countryRepository.fetchCountriesByIds).calledOnceWithExactly([
        country1._id,
        country2._id,
      ]);
      expect(languageRepository.fetchLanguagesByIds).calledOnceWithExactly([
        language1._id,
        language2._id,
      ]);
    });
  });
});
