import { pick } from 'lodash';
import { SecondStepTeachersForm, Teacher } from '../../../common/entities/teacher';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TaskNumber } from '../../common/entities/task';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { CompleteTeachersTask } from './complete-teachers-task';
import { GetTeacher } from './get-teacher';
import { submitSecondStepTeachersFormFactory } from './submit-second-step-teachers-form';

describe('submitSecondStepTeachersForm', () => {
  const email = 'currentTeachers@email.com';
  const teacher = buildTeacher({ properties: { email } });
  const update: SecondStepTeachersForm = {
    ...pick(buildTeacher(), ['facebook', 'instagram', 'linkedIn', 'website', 'about', 'photos']),
  };
  const updatedTeachersProfile: Teacher = { ...teacher, ...update };

  const getTeachersRepository = (teacher: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.updateTeacher.resolves(teacher);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetTeacher>().resolves(teacher);
  const getCompleteTeachersTask = () => stubFn<CompleteTeachersTask>().resolves();
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(updatedTeachersProfile),
    getTeacher = getGetTeacher(teacher),
    completeTeachersTask = getCompleteTeachersTask(),
  } = {}) => ({
    teachersRepository,
    getTeacher,
    completeTeachersTask,
    submitSecondStepTeachersForm: submitSecondStepTeachersFormFactory(
      teachersRepository,
      getTeacher,
      completeTeachersTask
    ),
  });

  it('should update, return current teacher and complete task', async () => {
    const {
      teachersRepository,
      getTeacher,
      completeTeachersTask,
      submitSecondStepTeachersForm,
    } = buildTestContext();
    expect(await submitSecondStepTeachersForm(update)).to.eql(updatedTeachersProfile);
    expect(getTeacher).calledOnceWithExactly({ throwOnNotFound: true });
    expect(teachersRepository.updateTeacher).calledOnceWithExactly(updatedTeachersProfile);
    expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.secondStepProfileForm);
  });

  context('on update validation failed', () => {
    const update = { facebook: '!!!!!not~!@#$$%%^   valid///' } as SecondStepTeachersForm;

    it('should return human readable error', async () => {
      const { getTeacher, submitSecondStepTeachersForm } = buildTestContext();
      await expect(submitSecondStepTeachersForm(update)).rejectedWith(
        /fails to match the required pattern/
      );
      expect(getTeacher).not.called;
    });
  });
});
