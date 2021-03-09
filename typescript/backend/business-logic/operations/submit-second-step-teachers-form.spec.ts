import { pick } from 'lodash';
import { SecondStepTeachersForm, TaskName, Teacher } from '../../../common/entities/teacher';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { GetTeacher } from './get-teacher';
import { submitSecondStepTeachersFormFactory } from './submit-second-step-teachers-form';

describe('submitSecondStepTeachersForm', () => {
  const email = 'currentTeachers@email.com';
  const teacher = buildTeacher({ properties: { email } });
  const update: SecondStepTeachersForm = {
    ...pick(buildTeacher(), ['facebook', 'instagram', 'linkedIn', 'website', 'about', 'photos']),
  };
  const updatedTeacher: Teacher = {
    ...teacher,
    ...update,
    completedTasks: [...teacher.completedTasks, TaskName.secondStepProfileForm],
  };

  const getTeachersRepository = (teacher: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.updateTeacher.resolves(teacher);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetTeacher>().resolves(teacher);
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(updatedTeacher),
    getTeacher = getGetTeacher(teacher),
  } = {}) => ({
    teachersRepository,
    getTeacher,
    submitSecondStepTeachersForm: submitSecondStepTeachersFormFactory(
      teachersRepository,
      getTeacher
    ),
  });

  it('should update, return current teacher and complete task', async () => {
    const { teachersRepository, getTeacher, submitSecondStepTeachersForm } = buildTestContext();
    expect(await submitSecondStepTeachersForm(update)).to.eql(updatedTeacher);
    expect(getTeacher).calledOnceWithExactly({ throwOnNotFound: true });
    expect(teachersRepository.updateTeacher).calledOnceWithExactly(updatedTeacher);
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
