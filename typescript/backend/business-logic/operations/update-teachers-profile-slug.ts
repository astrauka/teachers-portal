import { convert } from 'url-slug';

import { compact } from 'lodash';
import { TeachersProfile } from '../../common/entities/teachers-profile';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';

export const MAX_SLUG_POSTFIX = 20;

export function updateTeachersProfileSlugFactory(
  teachersProfileRepository: TeachersProfileRepository
) {
  return async function updateTeachersProfileSlug(
    teachersProfile: TeachersProfile
  ): Promise<TeachersProfile> {
    const slug = convert(teachersProfile.fullName);
    if (teachersProfile.slug === slug) {
      return teachersProfile;
    }

    return {
      ...teachersProfile,
      slug: (await getUnusedSlug(slug)) || teachersProfile._id,
    };
  };

  async function getUnusedSlug(slug: string): Promise<string | undefined> {
    for (let slugNumber = 0; slugNumber <= MAX_SLUG_POSTFIX; slugNumber++) {
      const candidateSlug = compact([slug, slugNumber]).join('-');
      if (!(await teachersProfileRepository.fetchTeachersProfileBySlug(candidateSlug))) {
        return candidateSlug;
      }
    }
  }
}