import { RegisteredTeachersInfo } from '../../common/entities/teachers-info';
import { TeachersInfoRepository } from '../../repositories/teachers-info-repository';
import { UsersService } from '../../services/users-service';
import { NotLoggedInError } from '../../utils/errors';

export function getCurrentTeachersInfoFactory(
  teachersInfoRepository: TeachersInfoRepository,
  usersService: UsersService
) {
  return async function getCurrentTeachersInfo(): Promise<RegisteredTeachersInfo> {
    const teachersInfo = await teachersInfoRepository.fetchTeacherByEmail<RegisteredTeachersInfo>(
      await usersService.getCurrentUserEmail()
    );
    if (teachersInfo) {
      return teachersInfo;
    }
    throw new NotLoggedInError();
  };
}

export type GetCurrentTeachersInfo = ReturnType<typeof getCurrentTeachersInfoFactory>;
