export function syncSiteMemberInformationFactory(usersService, siteMembersRepository) {
    return async function syncSiteMemberInformation(teacher) {
        var _a;
        const siteMember = await siteMembersRepository.fetchMemberByEmail(teacher.email);
        if (!siteMember) {
            return;
        }
        if (siteMember.firstName === teacher.firstName &&
            siteMember.lastName === teacher.lastName &&
            ((_a = siteMember.picture) === null || _a === void 0 ? void 0 : _a.url) === teacher.profileImage) {
            return;
        }
        return await usersService.updateUserFields(siteMember._id, {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            ...(teacher.profileImage && { picture: { url: teacher.profileImage } }),
        });
    };
}
