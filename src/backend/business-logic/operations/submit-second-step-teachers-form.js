import { TaskName } from '../../common/entities/teacher';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateSecondStepTeachersForm } from '../validate';
export function submitSecondStepTeachersFormFactory(teachersRepository, getTeacher) {
    return async function submitSecondStepTeachersForm(update) {
        validateSecondStepTeachersForm(update);
        const teacher = await getTeacher({ throwOnNotFound: true });
        const updatedTeacher = teachersRepository.updateTeacher({
            ...teacher,
            ...update,
            completedTasks: addCompletedTask(teacher, TaskName.secondStepProfileForm),
        });
        return updatedTeacher;
    };
}
