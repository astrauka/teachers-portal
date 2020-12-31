import {
  getCuratingTeacherView,
  getCurrentTeachersTasks,
  getCurrentTeacherView,
} from 'backend/backend-api';
import { memoize } from 'lodash';
import { TaskView } from './common/entities/task';
import { TeacherView } from './common/entities/teacher';

const state: {
  teacher?: TeacherView;
  curatingTeacher?: TeacherView;
  tasks?: TaskView[];
} = {};

export async function getCurrentTeacher() {
  if (state.teacher) {
    return state.teacher;
  }
  return fetchCurrentTeacher();
}

export function setCurrentTeacher(teacher: TeacherView): void {
  state.teacher = teacher;
}

const fetchCurrentTeacher = memoize(async () => {
  const teacher = await getCurrentTeacherView();
  state.teacher = teacher;
  return teacher;
});

export async function getTasks() {
  if (state.tasks) {
    return state.tasks;
  }
  return fetchTasks();
}

export async function refreshTasks(): Promise<void> {
  state.tasks = await getCurrentTeachersTasks();
}

const fetchTasks = memoize(async () => {
  const tasks = await getCurrentTeachersTasks();
  state.tasks = tasks;
  return tasks;
});

export async function getCuratingTeacher() {
  if (state.curatingTeacher) {
    return state.curatingTeacher;
  }
  return fetchCuratingTeacher();
}

const fetchCuratingTeacher = memoize(async () => {
  const curatingTeacher = await getCuratingTeacherView();
  state.curatingTeacher = curatingTeacher;
  return curatingTeacher;
});
