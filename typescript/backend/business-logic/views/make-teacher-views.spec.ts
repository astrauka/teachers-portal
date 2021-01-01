import { TeacherView } from '../../../common/entities/teacher';
import { buildCountry } from '../../../test/builders/country';
import { buildLanguage } from '../../../test/builders/language';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubType } from '../../../test/utils/stubbing';
import { CountriesRepository } from '../../repositories/countries-repository';
import { LanguagesRepository } from '../../repositories/languages-repository';
import { makeTeacherViewsFactory } from './make-teacher-views';

describe('makeTeacherViews', () => {
  const country1 = buildCountry({ id: 'country-1' });
  const country2 = buildCountry({ id: 'country-2' });
  const countries = [country2, country1];
  const language1 = buildLanguage({ id: 'language-1' });
  const language2 = buildLanguage({ id: 'language-2' });
  const languages = [language2, language1];
  const teacher1 = buildTeacher({
    id: 'profile-1',
    properties: { countryId: country1._id, languageId: language1._id },
  });
  const teacher2 = buildTeacher({
    id: 'profile-2',
    properties: { countryId: country2._id, languageId: language2._id },
  });
  const teachers = [teacher1, teacher2];
  const teacherView1: TeacherView = {
    ...teacher1,
    country: country1.title,
    language: language1.title,
    photos: teacher1.photos,
  };
  const teacherView2: TeacherView = {
    ...teacher2,
    country: country2.title,
    language: language2.title,
    photos: teacher1.photos,
  };
  const teacherViews = [teacherView1, teacherView2];

  const getCountriesRepository = (countries) =>
    stubType<CountriesRepository>((stub) => {
      stub.fetchCountriesByIds.resolves(countries);
    });
  const getLanguagesRepository = (languages) =>
    stubType<LanguagesRepository>((stub) => {
      stub.fetchLanguagesByIds.resolves(languages);
    });
  const buildTestContext = ({
    countriesRepository = getCountriesRepository(countries),
    languagesRepository = getLanguagesRepository(languages),
  } = {}) => ({
    countriesRepository,
    languagesRepository,
    makeTeacherViews: makeTeacherViewsFactory(countriesRepository, languagesRepository),
  });

  it('should return teachers view', async () => {
    const { countriesRepository, languagesRepository, makeTeacherViews } = buildTestContext();
    expect(await makeTeacherViews(teachers)).to.eql(teacherViews);
    expect(countriesRepository.fetchCountriesByIds).calledOnceWithExactly([
      country1._id,
      country2._id,
    ]);
    expect(languagesRepository.fetchLanguagesByIds).calledOnceWithExactly([
      language1._id,
      language2._id,
    ]);
  });

  context('on country and language not selected', () => {
    const teacher1 = buildTeacher({ without: ['countryId', 'languageId'] });
    const teacherView1 = { ...teacher1, country: undefined, language: undefined };

    it('should return no titles', async () => {
      const { countriesRepository, languagesRepository, makeTeacherViews } = buildTestContext({
        countriesRepository: getCountriesRepository([country2]),
        languagesRepository: getLanguagesRepository([language2]),
      });
      expect(await makeTeacherViews([teacher1, teacher2])).to.eql([teacherView1, teacherView2]);
      expect(countriesRepository.fetchCountriesByIds).calledOnceWithExactly([country2._id]);
      expect(languagesRepository.fetchLanguagesByIds).calledOnceWithExactly([language2._id]);
    });
  });

  context('on no teachers', () => {
    const teachers = [undefined];

    it('should not fetch anything', async () => {
      const { countriesRepository, languagesRepository, makeTeacherViews } = buildTestContext();
      expect(await makeTeacherViews(teachers)).to.eql([]);
      expect(countriesRepository.fetchCountriesByIds).not.called;
      expect(languagesRepository.fetchLanguagesByIds).not.called;
    });
  });

  context('on country and language not existing', () => {
    const countries = [country1];
    const languages = [language1];
    const teacherView2 = { ...teacher2, country: undefined, language: undefined };

    it('should return no titles', async () => {
      const { countriesRepository, languagesRepository, makeTeacherViews } = buildTestContext({
        countriesRepository: getCountriesRepository(countries),
        languagesRepository: getLanguagesRepository(languages),
      });
      expect(await makeTeacherViews(teachers)).to.eql([teacherView1, teacherView2]);
      expect(countriesRepository.fetchCountriesByIds).calledOnceWithExactly([
        country1._id,
        country2._id,
      ]);
      expect(languagesRepository.fetchLanguagesByIds).calledOnceWithExactly([
        language1._id,
        language2._id,
      ]);
    });
  });
});
