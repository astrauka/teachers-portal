import { compact } from 'lodash';
import { convert } from 'url-slug';
import { generateUuid } from '../../utils/id';
import { validateTeacher } from '../validate';
export const MAX_SLUG_POSTFIX = 20;
export const TEACHER_DEFAULTS = {
    slug: null,
    mentorId: null,
    certificateExpirationDate: null,
    siteMemberId: null,
    profileImage: '',
    phoneNumber: '',
    countryId: null,
    city: '',
    streetAddress: '',
    languageId: null,
    facebook: '',
    instagram: '',
    linkedIn: '',
    website: '',
    about: '',
    photos: [],
};
export function normalizeTeacherFactory(teachersRepository, generateId = generateUuid) {
    return async function normalizeTeacher(update) {
        const teacher = validateTeacher({
            ...TEACHER_DEFAULTS,
            ...update,
            fullName: `${update.firstName} ${update.lastName}`,
        });
        const slug = convert(teacher.fullName);
        if (teacher.slug === slug) {
            return teacher;
        }
        return {
            ...teacher,
            slug: (await getUnusedSlug(slug)) || generateId(),
        };
    };
    async function getUnusedSlug(slug) {
        for (let slugNumber = 0; slugNumber <= MAX_SLUG_POSTFIX; slugNumber++) {
            const candidateSlug = compact([slug, slugNumber]).join('-');
            if (!(await teachersRepository.fetchTeacherBySlug(candidateSlug))) {
                return candidateSlug;
            }
        }
    }
}
