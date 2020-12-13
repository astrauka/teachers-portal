import { TaskNumber } from '../../common/entities/task';
import { RecordNotFoundError } from '../../utils/errors';
import { validateSecondStepTeachersForm } from '../validators';
export function updateSecondStepTeachersProfileFactory(usersService, teachersProfileRepository, getTeachersProfile, completeTeachersTask) {
    return async function updateSecondStepTeachersProfile(update) {
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
