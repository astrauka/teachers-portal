import { buildCountry } from '../../../test/builders/country';
import { buildLanguage } from '../../../test/builders/language';
import { buildInitialTeacherForm, buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { CountriesRepository } from '../../repositories/countries-repository';
import { LanguagesRepository } from '../../repositories/languages-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { InitialTeacherForm, TaskName, Teacher } from '../../universal/entities/teacher';
import { GetCurrentTeacher } from './get-current-teacher';
import { submitInitialTeachersFormFactory } from './submit-initial-teachers-form';

describe('submitInitialTeachersForm', () => {
  const country = buildCountry();
  const language = buildLanguage();
  const teacher = buildTeacher({ properties: { completedTasks: [] } });
  const update = buildInitialTeacherForm();
  const updatedTeacher: Teacher = {
    ...teacher,
    ...update,
    completedTasks: [TaskName.initialProfileForm],
  };

  const getTeachersRepository = (teacher: Teacher, returnedTeachersProfile: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.updateTeacher.resolves(returnedTeachersProfile);
    });
  const getCountriesRepository = (country) =>
    stubType<CountriesRepository>((stub) => {
      stub.fetchCountryByIdOrThrow.resolves(country);
    });
  const getLanguagesRepository = (language) =>
    stubType<LanguagesRepository>((stub) => {
      stub.fetchLanguageByIdOrThrow.resolves(language);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetCurrentTeacher>().resolves(teacher);
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(teacher, updatedTeacher),
    countriesRepository = getCountriesRepository(country),
    languagesRepository = getLanguagesRepository(language),
    getCurrentTeacher = getGetTeacher(teacher),
  } = {}) => ({
    teachersRepository,
    countriesRepository,
    languagesRepository,
    getCurrentTeacher,
    submitInitialTeachersForm: submitInitialTeachersFormFactory(
      teachersRepository,
      countriesRepository,
      languagesRepository,
      getCurrentTeacher
    ),
  });

  it('should update, return current teacher and complete task', async () => {
    const {
      teachersRepository,
      countriesRepository,
      languagesRepository,
      getCurrentTeacher,
      submitInitialTeachersForm,
    } = buildTestContext();

    expect(await submitInitialTeachersForm(update)).to.eql(updatedTeacher);
    expect(getCurrentTeacher).calledOnceWithExactly();
    expect(countriesRepository.fetchCountryByIdOrThrow).calledOnceWithExactly(update.countryId);
    expect(languagesRepository.fetchLanguageByIdOrThrow).calledOnceWithExactly(update.languageId);
    expect(teachersRepository.updateTeacher).calledOnceWithExactly(updatedTeacher);
  });

  context('on update validation failed', () => {
    const update = { phoneNumber: '11', city: 'a' } as InitialTeacherForm;

    it('should return human readable error', async () => {
      const { getCurrentTeacher, submitInitialTeachersForm } = buildTestContext();
      await expect(submitInitialTeachersForm(update)).rejectedWith(/field is required/);
      expect(getCurrentTeacher).not.called;
    });
  });
});
