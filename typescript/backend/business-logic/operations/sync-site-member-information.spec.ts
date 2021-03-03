import { buildSiteMember } from '../../../test/builders/site-member';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubType } from '../../../test/utils/stubbing';
import { SiteMembersRepository } from '../../repositories/site-members-repository';
import { UsersService } from '../../services/users-service';
import { SiteMember } from '../../types/wix-types';
import { syncSiteMemberInformationFactory } from './sync-site-member-information';

describe('SyncSiteMemberInformation', () => {
  const siteMember = buildSiteMember();
  const teacher = buildTeacher();

  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.updateUserFields.resolves();
    });
  const getSiteMembersRepository = (siteMember: SiteMember) =>
    stubType<SiteMembersRepository>((stub) => {
      stub.fetchMemberByEmailOrThrow.resolves(siteMember);
    });
  const buildTestContext = ({
    usersService = getUsersService(),
    siteMembersRepository = getSiteMembersRepository(siteMember),
  } = {}) => ({
    usersService,
    siteMembersRepository,
    syncSiteMemberInformation: syncSiteMemberInformationFactory(
      usersService,
      siteMembersRepository
    ),
  });

  it('should update site members name and profile image', async () => {
    const { usersService, siteMembersRepository, syncSiteMemberInformation } = buildTestContext();
    await syncSiteMemberInformation(teacher);
    expect(siteMembersRepository.fetchMemberByEmailOrThrow).calledOnceWithExactly(teacher.email);
    expect(usersService.updateUserFields).calledOnceWithExactly(siteMember._id, {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      picture: { url: teacher.profileImage },
    });
  });

  context('on no site member related fields updated', () => {
    const teacher = buildTeacher({
      properties: {
        firstName: siteMember.firstName,
        lastName: siteMember.lastName,
        profileImage: siteMember.picture.url,
      },
    });

    it('should do nothing', async () => {
      const { usersService, siteMembersRepository, syncSiteMemberInformation } = buildTestContext();
      await syncSiteMemberInformation(teacher);
      expect(siteMembersRepository.fetchMemberByEmailOrThrow).calledOnceWithExactly(teacher.email);
      expect(usersService.updateUserFields).not.called;
    });
  });
});
