import { omit } from 'lodash';
import { TaskNumber } from '../../types/task';
import { validateTeachersProfileUpdate, } from '../../types/teachers-profile';
export function updateCurrentTeachersProfileFactory(teachersProfileRepository, countryRepository, languageRepository, getCurrentTeachersInfo, completeTeachersTask) {
    return async function updateCurrentTeachersProfile(update) {
        validateTeachersProfileUpdate(update);
        const [teachersInfo, country, language] = await Promise.all([
            getCurrentTeachersInfo(),
            countryRepository.fetchCountryByTitle(update.country),
            languageRepository.fetchLanguageByTitle(update.language),
        ]);
        const updateWithIds = {
            ...omit(update, ['country', 'language']),
            countryId: country._id,
            languageId: language._id,
        };
        const teachersProfile = await persistProfile(teachersInfo, updateWithIds);
        await completeTeachersTask(TaskNumber.initialProfileForm);
        return teachersProfile;
    };
    async function persistProfile(teachersInfo, updateWithIds) {
        const { email, userId, firstName, lastName } = teachersInfo;
        const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByEmail(email);
        if (teachersProfile) {
            return teachersProfileRepository.updateTeachersProfile({
                ...teachersProfile,
                ...updateWithIds,
            });
        }
        return teachersProfileRepository.insertTeachersProfile({
            ...updateWithIds,
            email,
            userId,
            fullName: `${firstName} ${lastName}`,
        });
    }
}
