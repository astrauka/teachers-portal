import { TaskNumber } from '../../common/entities/task';
import { SecondStepTeachersForm, TeachersProfile } from '../../common/entities/teachers-profile';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { UsersService } from '../../services/users-service';
import { RecordNotFoundError } from '../../utils/errors';
import { validateSecondStepTeachersForm } from '../validators';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetTeachersProfile } from './get-teachers-profile';

export function updateSecondStepTeachersProfileFactory(
  usersService: UsersService,
  teachersProfileRepository: TeachersProfileRepository,
  getTeachersProfile: GetTeachersProfile,
  completeTeachersTask: CompleteTeachersTask
) {
  return async function updateSecondStepTeachersProfile(
    update: SecondStepTeachersForm
  ): Promise<TeachersProfile> {
    validateSecondStepTeachersForm(update);
    const oldTeachersProfile = await getTeachersProfile();
    if (!oldTeachersProfile) {
      const email = await usersService.getCurrentUserEmail();
      throw new RecordNotFoundError(`TeachersProfile does not exist for ${email}`);
    }
    if (oldTeachersProfile) {
      const teachersProfile = teachersProfileRepository.updateTeachersProfile({
        ...oldTeachersProfile,
        ...update,
      });
      await completeTeachersTask(TaskNumber.secondStepProfileForm);
      return teachersProfile;
    }
  };
}
