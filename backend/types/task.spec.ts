import { buildTask } from '../../test/builders/task';
import { expect, getErrorOf } from '../../test/utils/expectations';
import { validateTask } from './task';

describe('validateTask', () => {
  const task = buildTask();

  it('should return task', () => {
    expect(validateTask(task)).to.eql(task);
  });

  context('on invalid input', () => {
    const task = buildTask({ properties: { number: 0, title: '' } });

    it('should throw', () => {
      const errorMessage = getErrorOf(() => validateTask(task)).message;
      expect(errorMessage).to.include("The 'number' field must be greater than or equal to 1");
      expect(errorMessage).to.include(
        "The 'title' field length must be greater than or equal to 1 characters long"
      );
    });
  });
});
