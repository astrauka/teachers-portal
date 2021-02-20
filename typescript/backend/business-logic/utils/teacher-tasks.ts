import { uniq } from 'lodash';
import { TaskName, Teacher } from '../../../common/entities/teacher';

export function addCompletedTask(teacher: Teacher, taskName: TaskName): TaskName[] {
  return uniq([...(teacher.completedTasks || []), taskName]);
}
