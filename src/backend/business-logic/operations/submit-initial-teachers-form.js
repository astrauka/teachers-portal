import { omit } from 'lodash';
import { TaskNumber } from '../../common/entities/task';
import { validateInitialTeachersForm } from '../validate';
export function submitInitialTeachersFormFactory(teachersRepository, countriesRepository, languagesRepository, getTeacher, completeTeachersTask) {
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
        const updatedTeacher = await teachersRepository.updateTeacher({
            ...teacher,
            ...updateWithIds,
        });
        await completeTeachersTask(TaskNumber.initialProfileForm);
        return updatedTeacher;
    };
}
