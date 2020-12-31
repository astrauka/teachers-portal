import { TaskNumber } from '../../common/entities/task';
import { validateSecondStepTeachersForm } from '../validate';
export function submitSecondStepTeachersFormFactory(teachersRepository, getTeacher, completeTeachersTask) {
    return async function submitSecondStepTeachersForm(update) {
        validateSecondStepTeachersForm(update);
        const updatedTeacher = teachersRepository.updateTeacher({
            ...(await getTeacher({ throwOnNotFound: true })),
            ...update,
        });
        await completeTeachersTask(TaskNumber.secondStepProfileForm);
        return updatedTeacher;
    };
}
