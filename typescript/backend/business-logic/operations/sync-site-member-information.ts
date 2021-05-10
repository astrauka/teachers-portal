import { SiteMembersRepository } from '../../repositories/site-members-repository';
import { UsersService } from '../../services/users-service';
import { Teacher } from '../../universal/entities/teacher';

export function syncSiteMemberInformationFactory(
  usersService: UsersService,
  siteMembersRepository: SiteMembersRepository
) {
  return async function syncSiteMemberInformation(teacher: Teacher): Promise<void> {
    const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
    if (!siteMember) {
      return;
    }
    if (
      siteMember.firstName === teacher.firstName &&
      siteMember.lastName === teacher.lastName &&
      siteMember.picture?.url === teacher.profileImage
    ) {
      return;
    }

    return await usersService.updateUserFields(siteMember._id, {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      ...(teacher.profileImage && { picture: { url: teacher.profileImage } }),
    });
  };
}

export type SyncSiteMemberInformation = ReturnType<typeof syncSiteMemberInformationFactory>;
