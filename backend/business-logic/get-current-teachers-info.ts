import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { UsersService } from '../services/users-service';
import { TeachersInfo } from '../types/teachers-info';

export function getCurrentTeachersInfoFactory(
  teachersInfoRepository: TeachersInfoRepository,
  usersService: UsersService
) {
  return async function getCurrentTeachersInfo(): Promise<TeachersInfo> {
    return teachersInfoRepository.fetchTeacherByEmail(await usersService.getCurrentUserEmail());
  };
}

export type GetCurrentTeachersInfo = ReturnType<typeof getCurrentTeachersInfoFactory>;
