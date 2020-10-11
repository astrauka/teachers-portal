import { OAuth2Client } from 'google-auth-library';
import { memoize } from 'lodash';
import { addTeacherToUsersFactory } from '../business-logic/operations/add-teacher-to-users';
import { authenticateTeacherFactory } from '../business-logic/operations/authenticate-teacher';
import { completeTeachersTaskFactory } from '../business-logic/operations/complete-teachers-task';
import { generatePasswordFactory } from '../business-logic/operations/generate-password';
import { getCuratingTeachersProfileFactory } from '../business-logic/operations/get-curating-teachers-profile';
import { getCurrentTeachersInfoFactory } from '../business-logic/operations/get-current-teachers-info';
import { getCurrentTeachersTasksFactory } from '../business-logic/operations/get-current-teachers-tasks';
import { getTeachersProfileFactory } from '../business-logic/operations/get-teachers-profile';
import { updateCurrentTeachersProfileFactory } from '../business-logic/operations/update-current-teachers-profile';
import { updateTeachersProfileSlugFactory } from '../business-logic/operations/update-teachers-profile-slug';
import { makeTeachersProfileViewsFactory } from '../business-logic/views/make-teachers-profile-view';
import { CountryRepository } from '../repositories/country-repository';
import { LanguageRepository } from '../repositories/language-repository';
import { MembersRepository } from '../repositories/members-repository';
import { TaskRepository } from '../repositories/task-repository';
import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { TeachersProfileRepository } from '../repositories/teachers-profile-repository';
import { GoogleAuthService } from '../services/google-auth-service';
import { UsersService } from '../services/users-service';
import { Externals } from './production-context';

export const setupContext = memoize(async (externals: Externals) => {
  const [GOOGLE_CLIENT_ID, PASSWORD_SECRET, PASSWORD_SALT] = await Promise.all([
    externals.getSecret('GOOGLE_CLIENT_ID'),
    externals.getSecret('PASSWORD_SECRET'),
    externals.getSecret('PASSWORD_SALT'),
  ]);

  const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

  const countryRepository = new CountryRepository(externals);
  const languageRepository = new LanguageRepository(externals);
  const membersRepository = new MembersRepository(externals);
  const taskRepository = new TaskRepository(externals);

  const googleAuthService = new GoogleAuthService(oauthClient, GOOGLE_CLIENT_ID);
  const teachersInfoRepository = new TeachersInfoRepository(externals);
  const teachersProfileRepository = new TeachersProfileRepository(externals);
  const usersService = new UsersService(externals);

  const generatePassword = generatePasswordFactory(PASSWORD_SECRET, PASSWORD_SALT);

  const addTeacherToUsers = addTeacherToUsersFactory(
    membersRepository,
    usersService,
    teachersInfoRepository,
    generatePassword
  );
  const authenticateTeacher = authenticateTeacherFactory(
    googleAuthService,
    teachersInfoRepository,
    usersService,
    generatePassword
  );

  const getCurrentTeachersInfo = getCurrentTeachersInfoFactory(
    teachersInfoRepository,
    usersService
  );

  const getTeachersProfile = getTeachersProfileFactory(teachersProfileRepository, usersService);
  const getCuratingTeachersProfile = getCuratingTeachersProfileFactory(
    getCurrentTeachersInfo,
    teachersInfoRepository
  );
  const completeTeachersTask = completeTeachersTaskFactory(
    getCurrentTeachersInfo,
    teachersInfoRepository,
    taskRepository
  );
  const updateCurrentTeachersProfile = updateCurrentTeachersProfileFactory(
    teachersProfileRepository,
    countryRepository,
    languageRepository,
    getCurrentTeachersInfo,
    completeTeachersTask
  );
  const updateTeachersProfileSlug = updateTeachersProfileSlugFactory(teachersProfileRepository);
  const getCurrentTeachersTasks = getCurrentTeachersTasksFactory(
    taskRepository,
    teachersInfoRepository,
    getCurrentTeachersInfo
  );

  const makeTeachersProfileViews = makeTeachersProfileViewsFactory(
    countryRepository,
    languageRepository
  );

  return {
    repositories: { countryRepository, languageRepository },
    services: {
      googleAuthService,
      membersRepository,
      teachersInfoRepository,
      teachersProfileRepository,
      usersService,
    },
    actions: {
      addTeacherToUsers,
      authenticateTeacher,
      getCurrentTeachersInfo,
      getTeachersProfile,
      getCuratingTeachersProfile,
      updateCurrentTeachersProfile,
      updateTeachersProfileSlug,
      getCurrentTeachersTasks,
    },
    views: {
      makeTeachersProfileViews,
    },
  };
});
