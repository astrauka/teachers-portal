import { Task, TaskNumber } from '../../common/entities/task';
import { builder } from './builder';

export const buildTask = builder<Task>((id) => ({
  _id: `${id}`,
  number: TaskNumber.initialProfileForm,
  title: `${id}-title`,
  buttonText: `${id}-button-text`,
  completedButtonText: `${id}-completed-button-text`,
  link: `${id}-link`,
}));
