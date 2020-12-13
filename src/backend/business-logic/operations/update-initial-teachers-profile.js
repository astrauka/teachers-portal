import { omit } from 'lodash';
import { TaskNumber } from '../../common/entities/task';
import { validateInitialTeachersForm } from '../validators';
export const TEACHERS_PROFILE_DEFAULTS = {
    facebook: '',
    instagram: '',
    linkedIn: '',
    about: '',
    website: '',
    photos: [],
};
export function updateInitialTeachersProfileFactory(teachersProfileRepository, countryRepository, languageRepository, getCurrentTeachersInfo, completeTeachersTask) {
    return async function updateInitialTeachersProfile(update) {
        validateInitialTeachersForm(update);
        const [teachersInfo, country, language] = await Promise.all([
            getCurrentTeachersInfo(),
            countryRepository.fetchCountryByTitleOrThrow(update.country),
            languageRepository.fetchLanguageByTitleOrThrow(update.language),
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
        const { email, firstName, lastName, levelId, statusId } = teachersInfo;
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
            fullName: `${firstName} ${lastName}`,
            levelId,
            statusId,
            teachersInfoId: teachersInfo._id,
            ...TEACHERS_PROFILE_DEFAULTS,
        });
    }
}
