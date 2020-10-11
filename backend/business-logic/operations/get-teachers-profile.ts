import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { UsersService } from '../../services/users-service';
import { TeachersProfile } from '../../types/teachers-profile';

export function getTeachersProfileFactory(
  teachersProfileRepository: TeachersProfileRepository,
  usersService: UsersService
) {
  return async function getTeachersProfile(email?: string): Promise<TeachersProfile | undefined> {
    return teachersProfileRepository.fetchTeachersProfileByEmail(
      email || (await usersService.getCurrentUserEmail())
    );
  };
}

export type GetTeachersProfile = ReturnType<typeof getTeachersProfileFactory>;
