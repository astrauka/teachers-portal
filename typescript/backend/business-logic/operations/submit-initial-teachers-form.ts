import { omit } from 'lodash';
import { TaskNumber } from '../../common/entities/task';
import { InitialTeacherForm, Teacher } from '../../common/entities/teacher';
import { CountriesRepository } from '../../repositories/countries-repository';
import { LanguagesRepository } from '../../repositories/languages-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { validateInitialTeachersForm } from '../validate';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetTeacher } from './get-teacher';

export function submitInitialTeachersFormFactory(
  teachersRepository: TeachersRepository,
  countriesRepository: CountriesRepository,
  languagesRepository: LanguagesRepository,
  getTeacher: GetTeacher,
  completeTeachersTask: CompleteTeachersTask
) {
  return async function submitInitialTeachersForm(update: InitialTeacherForm): Promise<Teacher> {
    validateInitialTeachersForm(update);
    const [teacher, country, language] = await Promise.all([
      getTeacher({ throwOnNotFound: true }),
      countriesRepository.fetchCountryByTitleOrThrow(update.country),
      languagesRepository.fetchLanguageByTitleOrThrow(update.language),
    ]);
    const updateWithIds: Partial<Teacher> = {
      ...omit(update, ['country', 'language']),
      countryId: country._id,
      languageId: language._id,
    };
    const updatedTeacher = await teachersRepository.updateTeacher({
      ...teacher,
      ...updateWithIds,
    });
    await completeTeachersTask(TaskNumber.initialProfileForm);
    return updatedTeacher;
  };
}
