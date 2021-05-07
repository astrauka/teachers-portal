import { TaskName } from '../../common/entities/teacher';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateInitialTeachersForm } from '../validate';
export function submitInitialTeachersFormFactory(teachersRepository, countriesRepository, languagesRepository, getCurrentTeacher) {
    return async function submitInitialTeachersForm(update) {
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
