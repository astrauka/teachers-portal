import { isEqual, pick } from 'lodash';
const FIELDS_TO_COPY = ['email', 'statusId', 'levelId', 'firstName', 'lastName'];
export function syncTeachersProfileDataFactory(teachersProfileRepository) {
    return async function syncTeachersProfileData(teachersInfo, { currentItem }) {
        await updateTeachersProfileDetails(teachersInfo, currentItem);
        return teachersInfo;
    };
    async function updateTeachersProfileDetails(teachersInfo, currentTeachersInfo) {
        if (isEqual(pick(teachersInfo, FIELDS_TO_COPY), pick(currentTeachersInfo, FIELDS_TO_COPY))) {
            return;
        }
        const { email, statusId, levelId, firstName, lastName } = teachersInfo;
        const teachersProfile = await teachersProfileRepository.fetchTeachersProfileByTeachersInfoId(teachersInfo._id);
        if (teachersProfile) {
            return teachersProfileRepository.updateTeachersProfile({
                ...teachersProfile,
                email,
                fullName: `${firstName} ${lastName}`,
                levelId,
                statusId,
                teachersInfoId: teachersInfo._id,
            });
        }
    }
}
