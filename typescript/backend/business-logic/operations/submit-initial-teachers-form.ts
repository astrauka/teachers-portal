import { omit } from 'lodash';
import { InitialTeacherForm, TaskName, Teacher } from '../../common/entities/teacher';
import { CountriesRepository } from '../../repositories/countries-repository';
import { LanguagesRepository } from '../../repositories/languages-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateInitialTeachersForm } from '../validate';
import { GetTeacher } from './get-teacher';

export function submitInitialTeachersFormFactory(
  teachersRepository: TeachersRepository,
  countriesRepository: CountriesRepository,
  languagesRepository: LanguagesRepository,
  getTeacher: GetTeacher
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
    return await teachersRepository.updateTeacher({
      ...teacher,
      ...updateWithIds,
      completedTasks: addCompletedTask(teacher, TaskName.initialProfileForm),
    });
  };
}
