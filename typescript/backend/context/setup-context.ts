import { hidePrivateTeacherDataFactory } from '../business-logic/hooks/hide-private-teacher-data';
import { normalizeTeacherFactory } from '../business-logic/hooks/normalize-teacher';
import { normalizeTeacherModuleFactory } from '../business-logic/hooks/normalize-teacher-module';
import { registerTeacherFactory } from '../business-logic/hooks/register-teacher';
import { getCuratingTeacherFactory } from '../business-logic/operations/get-curating-teacher';
import { getTeacherFactory } from '../business-logic/operations/get-teacher';
import { submitInitialTeachersFormFactory } from '../business-logic/operations/submit-initial-teachers-form';
import { submitSecondStepTeachersFormFactory } from '../business-logic/operations/submit-second-step-teachers-form';
import { syncSiteMemberInformationFactory } from '../business-logic/operations/sync-site-member-information';
import { makeTeacherViewsFactory } from '../business-logic/views/make-teacher-views';
import { AccountStatusesRepository } from '../repositories/account-statuses-repository';
import { CountriesRepository } from '../repositories/countries-repository';
import { LanguagesRepository } from '../repositories/languages-repository';
import { ModulesRepository } from '../repositories/modules-repository';
import { SiteMembersRepository } from '../repositories/site-members-repository';
import { TeachersRepository } from '../repositories/teachers-repository';
import { UsersService } from '../services/users-service';
import { EXTERNALS, Externals } from './production-context';

const setupContext = (externals: Externals) => {
  // services
  const usersService = new UsersService(externals);

  // repositories
  const countriesRepository = new CountriesRepository(externals);
  const languagesRepository = new LanguagesRepository(externals);
  const siteMembersRepository = new SiteMembersRepository(externals);
  const teachersRepository = new TeachersRepository(externals);
  const accountStatusesRepository = new AccountStatusesRepository(externals);
  const modulesRepository = new ModulesRepository(externals);

  // actions
  const getTeacher = getTeacherFactory(teachersRepository, usersService);
  const getCuratingTeacher = getCuratingTeacherFactory(getTeacher, teachersRepository);
  const submitInitialTeachersForm = submitInitialTeachersFormFactory(
    teachersRepository,
    countriesRepository,
    languagesRepository,
    getTeacher
  );
  const submitSecondStepTeachersForm = submitSecondStepTeachersFormFactory(
    teachersRepository,
    getTeacher
  );
  const syncSiteMemberInformation = syncSiteMemberInformationFactory(
    usersService,
    siteMembersRepository
  );

  // views
  const makeTeacherViews = makeTeacherViewsFactory(countriesRepository, languagesRepository);

  // hooks
  const registerTeacher = registerTeacherFactory(siteMembersRepository, usersService);
  const normalizeTeacher = normalizeTeacherFactory(teachersRepository, syncSiteMemberInformation);
  const hidePrivateTeacherData = hidePrivateTeacherDataFactory();
  const normalizeTeacherModule = normalizeTeacherModuleFactory(modulesRepository);

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
    },
    views: {
      makeTeacherViews,
    },
    hooks: {
      registerTeacher,
      normalizeTeacher,
      hidePrivateTeacherData,
      normalizeTeacherModule,
    },
  };
};

export const context = setupContext(EXTERNALS);
