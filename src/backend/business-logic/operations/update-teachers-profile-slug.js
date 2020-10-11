import * as urlSlug from 'url-slug';
import { compact } from 'lodash';
export const MAX_SLUG_POSTFIX = 20;
export function updateTeachersProfileSlugFactory(teachersProfileRepository) {
    return async function updateTeachersProfileSlug(teachersProfile) {
        const slug = urlSlug(teachersProfile.fullName);
        if (teachersProfile.slug === slug) {
            return teachersProfile;
        }
        return {
            ...teachersProfile,
            slug: (await getUnusedSlug(slug)) || teachersProfile._id,
        };
    };
    async function getUnusedSlug(slug) {
        for (let slugNumber = 0; slugNumber <= MAX_SLUG_POSTFIX; slugNumber++) {
            const candidateSlug = compact([slug, slugNumber]).join('-');
            if (!(await teachersProfileRepository.fetchTeachersProfileBySlug(candidateSlug))) {
                return candidateSlug;
            }
        }
    }
}
