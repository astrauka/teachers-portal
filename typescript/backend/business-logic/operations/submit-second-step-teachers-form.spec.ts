import { pick } from 'lodash';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { SecondStepTeachersForm, TaskName, Teacher } from '../../universal/entities/teacher';
import { GetCurrentTeacher } from './get-current-teacher';
import { submitSecondStepTeachersFormFactory } from './submit-second-step-teachers-form';

describe('submitSecondStepTeachersForm', () => {
  const email = 'currentTeachers@email.com';
  const teacher = buildTeacher({ properties: { email } });
  const update: SecondStepTeachersForm = {
    ...pick(buildTeacher(), ['facebook', 'instagram', 'linkedIn', 'website', 'about', 'photos']),
  };
  const updatedTeachersProfile: Teacher = {
    ...teacher,
    ...update,
    completedTasks: [...teacher.completedTasks, TaskName.secondStepProfileForm],
  };

  const getTeachersRepository = (teacher: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.updateTeacher.resolves(teacher);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetCurrentTeacher>().resolves(teacher);
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(updatedTeachersProfile),
    getCurrentTeacher = getGetTeacher(teacher),
  } = {}) => ({
    teachersRepository,
    getCurrentTeacher,
    submitSecondStepTeachersForm: submitSecondStepTeachersFormFactory(
      teachersRepository,
      getCurrentTeacher
    ),
  });

  it('should update, return current teacher and complete task', async () => {
    const {
      teachersRepository,
      getCurrentTeacher,
      submitSecondStepTeachersForm,
    } = buildTestContext();
    expect(await submitSecondStepTeachersForm(update)).to.eql(updatedTeachersProfile);
    expect(getCurrentTeacher).calledOnceWithExactly();
    expect(teachersRepository.updateTeacher).calledOnceWithExactly(updatedTeachersProfile);
  });

  context('on update validation failed', () => {
    const update = { facebook: '!!!!!not~!@#$$%%^   valid///' } as SecondStepTeachersForm;

    it('should return human readable error', async () => {
      const { getCurrentTeacher, submitSecondStepTeachersForm } = buildTestContext();
      await expect(submitSecondStepTeachersForm(update)).rejectedWith(
        /fails to match the required pattern/
      );
      expect(getCurrentTeacher).not.called;
    });
  });
});
