import { Task, TaskNumber } from '../../backend/types/task';
import { TeacherStatus } from '../../backend/types/teachers-info';
import { builder } from './builder';

export const buildTask = builder<Task>((id) => ({
  _id: `${id}`,
  number: TaskNumber.initialProfileForm,
  title: `${id}-title`,
  buttonText: `${id}-button-text`,
  completedButtonText: `${id}-completed-button-text`,
  link: TeacherStatus.Active,
}));
