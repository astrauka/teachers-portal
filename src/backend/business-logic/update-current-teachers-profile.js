import { omit } from 'lodash';
import { TaskNumber } from '../types/task';
import { validateTeachersProfileUpdate, } from '../types/teachers-profile';
export function updateCurrentTeachersProfileFactory(teachersProfileRepository, usersService, membersRepository, countryRepository, languageRepository, completeTeachersTask) {
    return async function updateCurrentTeachersProfile(update) {
        validateTeachersProfileUpdate(update);
        const [email, country, language] = await Promise.all([
            usersService.getCurrentUserEmail(),
            countryRepository.fetchCountryByTitle(update.country),
            languageRepository.fetchLanguageByTitle(update.language),
        ]);
        const updateWithIds = {
            ...omit(update, ['country', 'language']),
            countryId: country._id,
            languageId: language._id,
        };
        const teachersProfile = await persistProfile(email, updateWithIds);
        await completeTeachersTask(TaskNumber.initialProfileForm);
        return teachersProfile;
    };
    async function persistProfile(email, updateWithIds) {
        const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(email);
        if (teachersProfile) {
            return teachersProfileRepository.updateTeachersProfile({
                ...teachersProfile,
                ...updateWithIds,
            });
        }
        const member = await membersRepository.fetchMemberByEmail(email);
        return teachersProfileRepository.insertTeachersProfile({
            ...updateWithIds,
            email,
            userId: member._id,
        });
    }
}
