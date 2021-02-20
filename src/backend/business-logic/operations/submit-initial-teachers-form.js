import { omit } from 'lodash';
import { TaskName } from '../../common/entities/teacher';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateInitialTeachersForm } from '../validate';
export function submitInitialTeachersFormFactory(teachersRepository, countriesRepository, languagesRepository, getTeacher) {
    return async function submitInitialTeachersForm(update) {
        validateInitialTeachersForm(update);
        const [teacher, country, language] = await Promise.all([
            getTeacher({ throwOnNotFound: true }),
            countriesRepository.fetchCountryByTitleOrThrow(update.country),
            languagesRepository.fetchLanguageByTitleOrThrow(update.language),
        ]);
        const updateWithIds = {
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
