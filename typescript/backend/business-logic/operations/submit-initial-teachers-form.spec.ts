import { pick } from 'lodash';
import { InitialTeacherForm, TaskName, Teacher } from '../../../common/entities/teacher';
import { buildCountry } from '../../../test/builders/country';
import { buildLanguage } from '../../../test/builders/language';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { CountriesRepository } from '../../repositories/countries-repository';
import { LanguagesRepository } from '../../repositories/languages-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { GetTeacher } from './get-teacher';
import { submitInitialTeachersFormFactory } from './submit-initial-teachers-form';

describe('submitInitialTeachersForm', () => {
  const country = buildCountry();
  const language = buildLanguage();
  const teacher = buildTeacher({ properties: { completedTasks: [] } });
  const update: InitialTeacherForm = {
    ...pick(buildTeacher(), ['profileImage', 'phoneNumber', 'city']),
    country: country.title,
    language: language.title,
  };
  const updatedTeacher: Teacher = {
    ...teacher,
    ...pick(update, ['profileImage', 'phoneNumber', 'city']),
    countryId: country._id,
    languageId: language._id,
    completedTasks: [TaskName.initialProfileForm],
  };

  const getTeachersRepository = (teacher: Teacher, returnedTeacher: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.updateTeacher.resolves(returnedTeacher);
    });
  const getCountriesRepository = (country) =>
    stubType<CountriesRepository>((stub) => {
      stub.fetchCountryByTitleOrThrow.resolves(country);
    });
  const getLanguagesRepository = (language) =>
    stubType<LanguagesRepository>((stub) => {
      stub.fetchLanguageByTitleOrThrow.resolves(language);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetTeacher>().resolves(teacher);
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(teacher, updatedTeacher),
    countriesRepository = getCountriesRepository(country),
    languagesRepository = getLanguagesRepository(language),
    getTeacher = getGetTeacher(teacher),
  } = {}) => ({
    teachersRepository,
    languagesRepository,
    getTeacher,
    submitInitialTeachersForm: submitInitialTeachersFormFactory(
      teachersRepository,
      countriesRepository,
      languagesRepository,
      getTeacher
    ),
  });

  it('should update, return current teacher and complete task', async () => {
    const {
      teachersRepository,
      languagesRepository,
      getTeacher,
      submitInitialTeachersForm,
    } = buildTestContext();

    expect(await submitInitialTeachersForm(update)).to.eql(updatedTeacher);
    expect(getTeacher).calledOnceWithExactly({ throwOnNotFound: true });
    expect(languagesRepository.fetchLanguageByTitleOrThrow).calledOnceWithExactly(language.title);
    expect(teachersRepository.updateTeacher).calledOnceWithExactly(updatedTeacher);
  });

  context('on update validation failed', () => {
    const update = { phoneNumber: '11', city: 'a' } as InitialTeacherForm;

    it('should return human readable error', async () => {
      const { getTeacher, submitInitialTeachersForm } = buildTestContext();
      await expect(submitInitialTeachersForm(update)).rejectedWith(/field is required/);
      expect(getTeacher).not.called;
    });
  });
});
