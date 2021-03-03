import { Teacher } from '../../common/entities/teacher';
import { SiteMembersRepository } from '../../repositories/site-members-repository';
import { UsersService } from '../../services/users-service';

export function syncSiteMemberInformationFactory(
  usersService: UsersService,
  siteMembersRepository: SiteMembersRepository
) {
  return async function syncSiteMemberInformation(teacher: Teacher): Promise<void> {
    const siteMember = await siteMembersRepository.fetchMemberByEmailOrThrow(teacher.email);
    if (
      siteMember.firstName === teacher.firstName &&
      siteMember.lastName === teacher.lastName &&
      siteMember.picture.url === teacher.profileImage
    ) {
      return;
    }

    return await usersService.updateUserFields(siteMember._id, {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      picture: { url: teacher.profileImage },
    });
  };
}

export type SyncSiteMemberInformation = ReturnType<typeof syncSiteMemberInformationFactory>;
