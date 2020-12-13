import { pick } from 'lodash';
import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { TaskNumber } from '../../common/entities/task';
import { SecondStepTeachersForm, TeachersProfile } from '../../common/entities/teachers-profile';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { UsersService } from '../../services/users-service';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetTeachersProfile } from './get-teachers-profile';
import { updateSecondStepTeachersProfileFactory } from './update-second-step-teachers-profile';

describe('updateSecondStepTeachersProfileFactory', () => {
  const email = 'currentTeachers@email.com';
  const teachersProfile = buildTeachersProfile({ properties: { email } });
  const update: SecondStepTeachersForm = {
    ...pick(buildTeachersProfile(), ['facebook', 'instagram', 'linkedIn', 'website', 'about']),
  };
  const updatedTeachersProfile: TeachersProfile = { ...teachersProfile, ...update };

  const getUsersService = (email: string) =>
    createStubInstance(UsersService, (stub) => {
      stub.getCurrentUserEmail.resolves(email);
    });
  const getTeachersProfileRepository = (persistedTeachersProfile: TeachersProfile) =>
    createStubInstance(TeachersProfileRepository, (stub) => {
      stub.updateTeachersProfile.resolves(persistedTeachersProfile);
    });
  const getGetTeachersProfile = (teachersProfile: TeachersProfile) =>
    stubFn<GetTeachersProfile>().resolves(teachersProfile);
  const getCompleteTeachersTask = () => stubFn<CompleteTeachersTask>().resolves();
  const buildTestContext = ({
    usersService = getUsersService(email),
    teachersProfileRepository = getTeachersProfileRepository(updatedTeachersProfile),
    getTeachersProfile = getGetTeachersProfile(teachersProfile),
    completeTeachersTask = getCompleteTeachersTask(),
  } = {}) => ({
    usersService,
    teachersProfileRepository,
    getTeachersProfile,
    completeTeachersTask,
    updateSecondStepTeachersProfile: updateSecondStepTeachersProfileFactory(
      usersService,
      teachersProfileRepository,
      getTeachersProfile,
      completeTeachersTask
    ),
  });

  it('should update, return current teacher profile and complete task', async () => {
    const {
      usersService,
      teachersProfileRepository,
      getTeachersProfile,
      completeTeachersTask,
      updateSecondStepTeachersProfile,
    } = buildTestContext();
    expect(await updateSecondStepTeachersProfile(update)).to.eql(updatedTeachersProfile);
    expect(getTeachersProfile).calledOnceWithExactly();
    expect(teachersProfileRepository.updateTeachersProfile).calledOnceWithExactly(
      updatedTeachersProfile
    );
    expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.secondStepProfileForm);
    expect(usersService.getCurrentUserEmail).not.called;
  });

  context('on profile not existing', () => {
    const teachersProfile = undefined;

    it('should throw', async () => {
      const {
        usersService,
        teachersProfileRepository,
        getTeachersProfile,
        completeTeachersTask,
        updateSecondStepTeachersProfile,
      } = buildTestContext({
        getTeachersProfile: getGetTeachersProfile(teachersProfile),
      });
      await expect(updateSecondStepTeachersProfile(update)).rejectedWith(
        `does not exist for ${email}`
      );
      expect(getTeachersProfile).calledOnceWithExactly();
      expect(usersService.getCurrentUserEmail).calledOnceWithExactly();
      expect(teachersProfileRepository.updateTeachersProfile).not.called;
      expect(completeTeachersTask).not.called;
    });

    context('on update validation failed', () => {
      const update = { facebook: '!!!!!not~!@#$$%%^   valid///' } as SecondStepTeachersForm;

      it('should return human readable error', async () => {
        const { getTeachersProfile, updateSecondStepTeachersProfile } = buildTestContext();
        await expect(updateSecondStepTeachersProfile(update)).rejectedWith(
          /fails to match the required pattern/
        );
        expect(getTeachersProfile).not.called;
      });
    });
  });
});
