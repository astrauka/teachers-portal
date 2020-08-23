import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { UsersService } from '../services/users-service';
import { RegisteredTeachersInfo } from '../types/teachers-info';

export function getCurrentTeachersInfoFactory(
  teachersInfoRepository: TeachersInfoRepository,
  usersService: UsersService
) {
  return async function getCurrentTeachersInfo(): Promise<RegisteredTeachersInfo> {
    return teachersInfoRepository.fetchTeacherByEmail<RegisteredTeachersInfo>(
      await usersService.getCurrentUserEmail()
    );
  };
}

export type GetCurrentTeachersInfo = ReturnType<typeof getCurrentTeachersInfoFactory>;
