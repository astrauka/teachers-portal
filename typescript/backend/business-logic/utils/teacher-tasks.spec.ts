import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { TaskName } from '../../universal/entities/teacher';

import { addCompletedTask } from './teacher-tasks';

describe('addCompletedTask', () => {
  const teacher = buildTeacher({
    properties: { completedTasks: [TaskName.initialProfileForm] },
  });
  const newTask = TaskName.secondStepProfileForm;

  it('should return completedTasks with added task', () => {
    expect(addCompletedTask(teacher, newTask)).to.eql([TaskName.initialProfileForm, newTask]);
  });

  context('on adding a duplicate', () => {
    const newTask = TaskName.initialProfileForm;

    it('should return same value', () => {
      expect(addCompletedTask(teacher, newTask)).to.eql([TaskName.initialProfileForm]);
    });
  });

  context('on teacher with no tasks', () => {
    const teacher = buildTeacher({ properties: { completedTasks: null } });

    it('should return array with added value', () => {
      expect(addCompletedTask(teacher, newTask)).to.eql([newTask]);
    });
  });
});
