import { registerTeacherFactory } from '../business-logic/hooks/teacher/register-teacher';
import { getCuratingTeacherFactory } from '../business-logic/operations/get-curating-teacher';
import { getTeacherFactory } from '../business-logic/operations/get-teacher';
import { normalizeTeacherFactory } from '../business-logic/operations/normalize-teacher';
import { submitInitialTeachersFormFactory } from '../business-logic/operations/submit-initial-teachers-form';
import { submitSecondStepTeachersFormFactory } from '../business-logic/operations/submit-second-step-teachers-form';
import { syncSiteMemberInformationFactory } from '../business-logic/operations/sync-site-member-information';
import { makeTeacherViewsFactory } from '../business-logic/views/make-teacher-views';
import { AccountStatusesRepository } from '../repositories/account-statuses-repository';
import { CountriesRepository } from '../repositories/countries-repository';
import { LanguagesRepository } from '../repositories/languages-repository';
import { SiteMembersRepository } from '../repositories/site-members-repository';
import { TeachersRepository } from '../repositories/teachers-repository';
import { UsersService } from '../services/users-service';
import { EXTERNALS } from './production-context';
const setupContext = (externals) => {
    // services
    const usersService = new UsersService(externals);
    // repositories
    const countriesRepository = new CountriesRepository(externals);
    const languagesRepository = new LanguagesRepository(externals);
    const siteMembersRepository = new SiteMembersRepository(externals);
    const teachersRepository = new TeachersRepository(externals);
    const accountStatusesRepository = new AccountStatusesRepository(externals);
    // actions
    const getTeacher = getTeacherFactory(teachersRepository, usersService);
    const getCuratingTeacher = getCuratingTeacherFactory(getTeacher, teachersRepository);
    const submitInitialTeachersForm = submitInitialTeachersFormFactory(teachersRepository, countriesRepository, languagesRepository, getTeacher);
    const submitSecondStepTeachersForm = submitSecondStepTeachersFormFactory(teachersRepository, getTeacher);
    const syncSiteMemberInformation = syncSiteMemberInformationFactory(usersService, siteMembersRepository);
    const normalizeTeacher = normalizeTeacherFactory(teachersRepository, syncSiteMemberInformation);
    // views
    const makeTeacherViews = makeTeacherViewsFactory(countriesRepository, languagesRepository);
    // hooks
    const registerTeacher = registerTeacherFactory(siteMembersRepository, usersService);
    return {
        repositories: {
            accountStatusesRepository,
            countriesRepository,
            languagesRepository,
            siteMembersRepository,
            teachersRepository,
        },
        services: {
            usersService,
        },
        actions: {
            getTeacher,
            getCuratingTeacher,
            submitInitialTeachersForm,
            submitSecondStepTeachersForm,
            normalizeTeacher,
        },
        views: {
            makeTeacherViews,
        },
        hooks: {
            registerTeacher,
        },
    };
};
export const context = setupContext(EXTERNALS);
