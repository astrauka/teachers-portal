import { uniq } from 'lodash';
export function addCompletedTask(teacher, taskName) {
    return uniq([...(teacher.completedTasks || []), taskName]);
}
