import { makeTeacherViewFactory } from '../business-logic/hooks/make-teacher-view';
import { normalizeTeacherFactory } from '../business-logic/hooks/normalize-teacher';
import { normalizeTeacherModuleFactory } from '../business-logic/hooks/normalize-teacher-module';
import { registerTeacherFactory } from '../business-logic/hooks/register-teacher';
import { cleanTestTeacherFactory } from '../business-logic/operations/test-teacher/clean-test-teacher';
import { cleanTestTeacherFieldsFactory } from '../business-logic/operations/test-teacher/clean-test-teacher-fields';
import { createTestTeacherFactory } from '../business-logic/operations/test-teacher/create-test-teacher';
import { getCuratingTeacherFactory } from '../business-logic/operations/get-curating-teacher';
import { getCurrentTeacherFactory } from '../business-logic/operations/get-current-teacher';
import { submitInitialTeachersFormFactory } from '../business-logic/operations/submit-initial-teachers-form';
import { submitSecondStepTeachersFormFactory } from '../business-logic/operations/submit-second-step-teachers-form';
import { syncSiteMemberInformationFactory } from '../business-logic/operations/sync-site-member-information';
import { AccountStatusesRepository } from '../repositories/account-statuses-repository';
import { CountriesRepository } from '../repositories/countries-repository';
import { LanguagesRepository } from '../repositories/languages-repository';
import { ModulesRepository } from '../repositories/modules-repository';
import { SiteMembersRepository } from '../repositories/site-members-repository';
import { TeachersRepository } from '../repositories/teachers-repository';
import { SecretsService } from '../services/secrets-service';
import { UsersService } from '../services/users-service';

import { EXTERNALS, Externals } from './production-context';

const setupContext = (externals: Externals) => {
  // repositories
  const countriesRepository = new CountriesRepository(externals);
  const languagesRepository = new LanguagesRepository(externals);
  const siteMembersRepository = new SiteMembersRepository(externals);
  const teachersRepository = new TeachersRepository(externals);
  const accountStatusesRepository = new AccountStatusesRepository(externals);
  const modulesRepository = new ModulesRepository(externals);

  // services
  const usersService = new UsersService(externals, siteMembersRepository);
  const secretsService = new SecretsService(externals);

  const syncSiteMemberInformation = syncSiteMemberInformationFactory(
    usersService,
    siteMembersRepository
  );

  // hooks
  const registerTeacher = registerTeacherFactory(
    siteMembersRepository,
    usersService,
    secretsService
  );
  const normalizeTeacher = normalizeTeacherFactory(teachersRepository, syncSiteMemberInformation);
  const makeTeacherView = makeTeacherViewFactory();
  const normalizeTeacherModule = normalizeTeacherModuleFactory(modulesRepository);

  // actions
  const getCurrentTeacher = getCurrentTeacherFactory(
    teachersRepository,
    usersService,
    makeTeacherView
  );
  const getCuratingTeacher = getCuratingTeacherFactory(getCurrentTeacher, teachersRepository);
  const submitInitialTeachersForm = submitInitialTeachersFormFactory(
    teachersRepository,
    countriesRepository,
    languagesRepository,
    getCurrentTeacher
  );
  const submitSecondStepTeachersForm = submitSecondStepTeachersFormFactory(
    teachersRepository,
    getCurrentTeacher
  );

  // test actions
  const cleanTestTeacher = cleanTestTeacherFactory(teachersRepository, usersService);
  const cleanTestTeacherFields = cleanTestTeacherFieldsFactory(teachersRepository);
  const createTestTeacher = createTestTeacherFactory(teachersRepository);

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
      getCurrentTeacher,
      getCuratingTeacher,
      submitInitialTeachersForm,
      submitSecondStepTeachersForm,
      cleanTestTeacher,
      cleanTestTeacherFields,
      createTestTeacher,
    },
    hooks: {
      registerTeacher,
      normalizeTeacher,
      makeTeacherView,
      normalizeTeacherModule,
    },
  };
};

export const context = setupContext(EXTERNALS);
