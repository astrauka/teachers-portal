import { TeachersRepository } from '../../repositories/teachers-repository';
import { UsersService } from '../../services/users-service';
import { Teacher } from '../../universal/entities/teacher';
import { MakeTeacherView } from '../hooks/make-teacher-view';

export function getCurrentTeacherFactory(
  teachersRepository: TeachersRepository,
  usersService: UsersService,
  makeTeacherView: MakeTeacherView
) {
  return async function getCurrentTeacher(): Promise<Teacher> {
    const teachersEmail = await usersService.getCurrentUserEmail();
    const returnPrivateFields = true;
    return makeTeacherView(
      await teachersRepository.fetchTeacherByEmailOrThrow(teachersEmail, returnPrivateFields),
      { returnPrivateFields }
    );
  };
}

export type GetCurrentTeacher = ReturnType<typeof getCurrentTeacherFactory>;
