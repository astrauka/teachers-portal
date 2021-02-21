export function getTeacherFactory(teachersRepository, usersService) {
    return async function getTeacher({ email, throwOnNotFound = false, } = {}) {
        const teachersEmail = email || (await usersService.getCurrentUserEmail());
        return throwOnNotFound
            ? teachersRepository.fetchTeacherByEmailOrThrow(teachersEmail)
            : teachersRepository.fetchTeacherByEmail(teachersEmail);
    };
}
