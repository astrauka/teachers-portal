import { SecondStepTeachersForm, TaskName, Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateSecondStepTeachersForm } from '../validate';
import { GetCurrentTeacher } from './get-current-teacher';

export function submitSecondStepTeachersFormFactory(
  teachersRepository: TeachersRepository,
  getCurrentTeacher: GetCurrentTeacher
) {
  return async function submitSecondStepTeachersForm(
    update: SecondStepTeachersForm
  ): Promise<Teacher> {
    validateSecondStepTeachersForm(update);
    const teacher = await getCurrentTeacher();
    const updatedTeacher = teachersRepository.updateTeacher({
      ...teacher,
      ...update,
      completedTasks: addCompletedTask(teacher, TaskName.secondStepProfileForm),
    });
    return updatedTeacher;
  };
}
