export function getCurrentTeacherFactory(teachersRepository, usersService, makeTeacherView) {
    return async function getCurrentTeacher() {
        const teachersEmail = await usersService.getCurrentUserEmail();
        const returnPrivateFields = true;
        return makeTeacherView(await teachersRepository.fetchTeacherByEmailOrThrow(teachersEmail, returnPrivateFields), {
            returnPrivateFields,
        });
    };
}
