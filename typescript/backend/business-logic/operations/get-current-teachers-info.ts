import { RegisteredTeachersInfo } from '../../../common/types/teachers-info';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { UsersService } from '../../services/users-service';

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
