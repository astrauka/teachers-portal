import { OAuth2Client } from 'google-auth-library';
import { memoize } from 'lodash';
import { registerTeacherFactory } from '../business-logic/hooks/teacher/register-teacher';
import { authenticateTeacherFactory } from '../business-logic/operations/authenticate-teacher';
import { completeTeachersTaskFactory } from '../business-logic/operations/complete-teachers-task';
import { generatePasswordFactory } from '../business-logic/operations/generate-password';
import { getCuratingTeacherFactory } from '../business-logic/operations/get-curating-teacher';
import { getTeachersTasksFactory } from '../business-logic/operations/get-current-teachers-tasks';
import { getTeacherFactory } from '../business-logic/operations/get-teacher';
import { normalizeTeacherFactory } from '../business-logic/operations/normalize-teacher';
import { submitInitialTeachersFormFactory } from '../business-logic/operations/submit-initial-teachers-form';
import { submitSecondStepTeachersFormFactory } from '../business-logic/operations/submit-second-step-teachers-form';
import { makeTeacherViewsFactory } from '../business-logic/views/make-teacher-views';
import { CountriesRepository } from '../repositories/countries-repository';
import { LanguagesRepository } from '../repositories/languages-repository';
import { SiteMembersRepository } from '../repositories/site-members-repository';
import { TasksRepository } from '../repositories/tasks-repository';
import { TeachersRepository } from '../repositories/teachers-repository';
import { GoogleAuthService } from '../services/google-auth-service';
import { UsersService } from '../services/users-service';
export const setupContext = memoize(async (externals) => {
    const [GOOGLE_CLIENT_ID, PASSWORD_SECRET, PASSWORD_SALT] = await Promise.all([
        externals.getSecret('GOOGLE_CLIENT_ID'),
        externals.getSecret('PASSWORD_SECRET'),
        externals.getSecret('PASSWORD_SALT'),
    ]);
    // services
    const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const googleAuthService = new GoogleAuthService(oauthClient, GOOGLE_CLIENT_ID);
    const usersService = new UsersService(externals);
    // repositories
    const countriesRepository = new CountriesRepository(externals);
    const languagesRepository = new LanguagesRepository(externals);
    const siteMembersRepository = new SiteMembersRepository(externals);
    const tasksRepository = new TasksRepository(externals);
    const teachersRepository = new TeachersRepository(externals);
    // actions
    const generatePassword = generatePasswordFactory(PASSWORD_SECRET, PASSWORD_SALT);
    const authenticateTeacher = authenticateTeacherFactory(googleAuthService, teachersRepository, usersService, generatePassword);
    const getTeacher = getTeacherFactory(teachersRepository, usersService);
    const getCuratingTeacher = getCuratingTeacherFactory(getTeacher, teachersRepository);
    const completeTeachersTask = completeTeachersTaskFactory(getTeacher, teachersRepository, tasksRepository);
    const submitInitialTeachersForm = submitInitialTeachersFormFactory(teachersRepository, countriesRepository, languagesRepository, getTeacher, completeTeachersTask);
    const submitSecondStepTeachersForm = submitSecondStepTeachersFormFactory(teachersRepository, getTeacher, completeTeachersTask);
    const normalizeTeacher = normalizeTeacherFactory(teachersRepository);
    const getTeachersTasks = getTeachersTasksFactory(tasksRepository, teachersRepository, getTeacher);
    // views
    const makeTeacherViews = makeTeacherViewsFactory(countriesRepository, languagesRepository);
    // hooks
    const registerTeacher = registerTeacherFactory(siteMembersRepository, usersService, teachersRepository, generatePassword);
    return {
        repositories: {
            countriesRepository,
            languagesRepository,
            siteMembersRepository,
            teachersRepository,
        },
        services: {
            googleAuthService,
            usersService,
        },
        actions: {
            authenticateTeacher,
            getTeacher,
            getCuratingTeacher,
            submitInitialTeachersForm,
            submitSecondStepTeachersForm,
            normalizeTeacher,
            getTeachersTasks,
        },
        views: {
            makeTeacherViews,
        },
        hooks: {
            registerTeacher,
        },
    };
});
