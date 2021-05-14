import { CountriesRepository } from '../../repositories/countries-repository';
import { LanguagesRepository } from '../../repositories/languages-repository';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { InitialTeacherForm, TaskName, Teacher } from '../../universal/entities/teacher';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateInitialTeachersForm } from '../validate';

import { GetCurrentTeacher } from './get-current-teacher';

export function submitInitialTeachersFormFactory(
  teachersRepository: TeachersRepository,
  countriesRepository: CountriesRepository,
  languagesRepository: LanguagesRepository,
  getCurrentTeacher: GetCurrentTeacher
) {
  return async function submitInitialTeachersForm(update: InitialTeacherForm): Promise<Teacher> {
    validateInitialTeachersForm(update);
    const [teacher] = await Promise.all([
      getCurrentTeacher(),
      countriesRepository.fetchCountryByIdOrThrow(update.countryId),
      languagesRepository.fetchLanguageByIdOrThrow(update.languageId),
    ]);
    return await teachersRepository.updateTeacher({
      ...teacher,
      ...update,
      completedTasks: addCompletedTask(teacher, TaskName.initialProfileForm),
    });
  };
}
