import { compact } from 'lodash';
import { convert } from 'url-slug';
import { AdminFilledInformation, Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { generateUuid, IdProvider } from '../../utils/id';
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
  completedTasks: [],
};

export function normalizeTeacherFactory(
  teachersRepository: TeachersRepository,
  generateId: IdProvider = generateUuid
) {
  return async function normalizeTeacher(
    update: Partial<Teacher> & AdminFilledInformation
  ): Promise<Teacher> {
    const facebook = getSocialLinkUsername(update.facebook, 'facebook.com/');
    const instagram = getSocialLinkUsername(update.instagram, 'instagram.com/');
    const linkedIn = getSocialLinkUsername(update.linkedIn, 'linkedin.com/in/');
    const teacher: Teacher = validateTeacher({
      ...TEACHER_DEFAULTS,
      ...update,
      fullName: `${update.firstName} ${update.lastName}`,
      ...(facebook && { facebook }),
      ...(instagram && { instagram }),
      ...(linkedIn && { linkedIn }),
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

  async function getUnusedSlug(slug: string): Promise<string | undefined> {
    for (let slugNumber = 0; slugNumber <= MAX_SLUG_POSTFIX; slugNumber++) {
      const candidateSlug = compact([slug, slugNumber]).join('-');
      if (!(await teachersRepository.fetchTeacherBySlug(candidateSlug))) {
        return candidateSlug;
      }
    }
  }

  function getSocialLinkUsername(linkOrUsername: string, separator: string): string | undefined {
    return linkOrUsername ? linkOrUsername.split(separator)[1] || linkOrUsername : undefined;
  }
}
