import { OAuth2Client } from 'google-auth-library';
import { memoize } from 'lodash';
import { addTeacherToUsersFactory } from '../business-logic/add-teacher-to-users';
import { authenticateTeacherFactory } from '../business-logic/authenticate-teacher';
import { completeTeachersTaskFactory } from '../business-logic/complete-teachers-task';
import { generatePasswordFactory } from '../business-logic/generate-password';
import { getCurrentTeachersInfoFactory } from '../business-logic/get-current-teachers-info';
import { getCurrentTeachersProfileFactory } from '../business-logic/get-current-teachers-profile';
import { getCurrentTeachersTasksFactory } from '../business-logic/get-current-teachers-tasks';
import { updateCurrentTeachersProfileFactory } from '../business-logic/update-current-teachers-profile';
import { CountryRepository } from '../repositories/country-repository';
import { LanguageRepository } from '../repositories/language-repository';
import { MembersRepository } from '../repositories/members-repository';
import { TaskRepository } from '../repositories/task-repository';
import { TeachersInfoRepository } from '../repositories/teachers-info-repository';
import { TeachersProfileRepository } from '../repositories/teachers-profile-repository';
import { GoogleAuthService } from '../services/google-auth-service';
import { UsersService } from '../services/users-service';
export const setupContext = memoize(async (externals) => {
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
    const addTeacherToUsers = addTeacherToUsersFactory(membersRepository, usersService, teachersInfoRepository, generatePassword);
    const authenticateTeacher = authenticateTeacherFactory(googleAuthService, teachersInfoRepository, usersService, generatePassword);
    const getCurrentTeachersInfo = getCurrentTeachersInfoFactory(teachersInfoRepository, usersService);
    const getCurrentTeachersProfile = getCurrentTeachersProfileFactory(countryRepository, languageRepository, teachersProfileRepository, usersService);
    const completeTeachersTask = completeTeachersTaskFactory(getCurrentTeachersInfo, teachersInfoRepository, taskRepository);
    const updateCurrentTeachersProfile = updateCurrentTeachersProfileFactory(teachersProfileRepository, countryRepository, languageRepository, getCurrentTeachersInfo, completeTeachersTask);
    const getCurrentTeachersTasks = getCurrentTeachersTasksFactory(taskRepository, teachersInfoRepository, getCurrentTeachersInfo);
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
            getCurrentTeachersProfile,
            updateCurrentTeachersProfile,
            getCurrentTeachersTasks,
        },
    };
});
