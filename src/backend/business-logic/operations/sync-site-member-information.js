export function syncSiteMemberInformationFactory(usersService, siteMembersRepository) {
    return async function syncSiteMemberInformation(teacher) {
        const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (!siteMember) {
            return;
        }
        if (siteMember.firstName === teacher.firstName &&
            siteMember.lastName === teacher.lastName &&
            siteMember.picture.url === teacher.profileImage) {
            return;
        }
        return await usersService.updateUserFields(siteMember._id, {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            picture: { url: teacher.profileImage },
        });
    };
}
