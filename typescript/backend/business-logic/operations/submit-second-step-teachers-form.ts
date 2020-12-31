import { TaskNumber } from '../../common/entities/task';
import { SecondStepTeachersForm, Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { validateSecondStepTeachersForm } from '../validate';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetTeacher } from './get-teacher';

export function submitSecondStepTeachersFormFactory(
  teachersRepository: TeachersRepository,
  getTeacher: GetTeacher,
  completeTeachersTask: CompleteTeachersTask
) {
  return async function submitSecondStepTeachersForm(
    update: SecondStepTeachersForm
  ): Promise<Teacher> {
    validateSecondStepTeachersForm(update);
    const updatedTeacher = teachersRepository.updateTeacher({
      ...(await getTeacher({ throwOnNotFound: true })),
      ...update,
    });
    await completeTeachersTask(TaskNumber.secondStepProfileForm);
    return updatedTeacher;
  };
}
