import { Storable } from './storable';

export interface Task extends Storable {
  number: number;
  title: string;
  buttonText: string;
  completedButtonText: string;
  link: string;
}

export interface TaskView extends Task {
  isCompleted: boolean;
}

export enum TaskNumber {
  initialProfileForm = 1,
  secondStepProfileForm = 2,
}

export enum TaskStatus {
  completed = 'completed',
  current = 'current',
  upcoming = 'upcoming',
}
