import { compact, pick, trim } from 'lodash';
import { convert } from 'url-slug';
import { TEACHER_DEFAULTS, } from '../../universal/entities/teacher';
import { normalizeSecondStepTeacherFormInput } from '../../universal/normalize-inputs/second-step-teacher-form-inputs';
import { generateUuid } from '../../utils/id';
import { getLogger, prettyJSON } from '../../utils/logger';
import { validateTeacher } from '../validate';
export const MAX_SLUG_POSTFIX = 20;
export function normalizeTeacherFactory(teachersRepository, syncSiteMemberInformation, generateId = generateUuid) {
    return async function normalizeTeacher(update, throwOnSyncMemberInformationFailure) {
        const facebook = normalizeSecondStepTeacherFormInput('facebook', update.facebook);
        const instagram = normalizeSecondStepTeacherFormInput('instagram', update.instagram);
        const linkedIn = normalizeSecondStepTeacherFormInput('linkedIn', update.linkedIn);
        const fullName = `${update.firstName} ${update.lastName}`;
        const slug = convert(fullName);
        const teacher = validateTeacher({
            ...TEACHER_DEFAULTS,
            ...update,
            email: trim(update.email),
            fullName,
            ...(facebook && { facebook }),
            ...(instagram && { instagram }),
            ...(linkedIn && { linkedIn }),
            slug: update.slug === slug ? slug : (await getUnusedSlug(slug)) || generateId(),
        });
        try {
            await syncSiteMemberInformation(teacher);
        }
        catch (error) {
            getLogger('normalizeTeacher').error(`syncSiteMemberInformation failed for ${prettyJSON(pick(teacher, ['email', 'firstName', 'lastName', 'profileImage']))}`);
            if (throwOnSyncMemberInformationFailure) {
                throw error;
            }
        }
        return teacher;
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
