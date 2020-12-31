import { Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { UsersService } from '../../services/users-service';

export function getTeacherFactory(
  teachersRepository: TeachersRepository,
  usersService: UsersService
) {
  return async function getTeacher({
    email,
    throwOnNotFound = false,
  }: {
    email?: string;
    throwOnNotFound?: boolean;
  } = {}): Promise<Teacher | undefined> {
    const teachersEmail = email || (await usersService.getCurrentUserEmail());
    return throwOnNotFound
      ? teachersRepository.fetchTeacherByEmailOrThrow(teachersEmail)
      : teachersRepository.fetchTeacherByEmail(teachersEmail);
  };
}

export type GetTeacher = ReturnType<typeof getTeacherFactory>;
