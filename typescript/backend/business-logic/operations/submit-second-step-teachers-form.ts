import { SecondStepTeachersForm, TaskName, Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { addCompletedTask } from '../utils/teacher-tasks';
import { validateSecondStepTeachersForm } from '../validate';
import { GetTeacher } from './get-teacher';

export function submitSecondStepTeachersFormFactory(
  teachersRepository: TeachersRepository,
  getTeacher: GetTeacher
) {
  return async function submitSecondStepTeachersForm(
    update: SecondStepTeachersForm
  ): Promise<Teacher> {
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
