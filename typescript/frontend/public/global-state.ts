import {
  getCuratingTeacherView,
  getCurrentTeachersTasks,
  getCurrentTeacherView,
} from 'backend/backend-api';
import { memory } from 'wix-storage';
import { TaskView } from './common/entities/task';
import { TeacherView } from './common/entities/teacher';
import { InitialState } from './for-current-teacher';

enum GlobalState {
  Teacher = 'teacher',
  Tasks = 'tasks',
  CuratingTeacher = 'curatingTeacher',
  isInitialStateLoaded = 'isInitialStateLoaded',
}

async function fetchItem<T>(
  item: GlobalState,
  fetchFn: () => Promise<T>,
  refresh = false
): Promise<T> {
  if (!refresh) {
    const persisted = memory.getItem(item);
    if (persisted) {
      return JSON.parse(persisted);
    }
  }
  try {
    const fetched = await fetchFn();
    if (fetched) {
      memory.setItem(item, JSON.stringify(fetched));
    }
    return fetched;
  } catch (error) {
    console.error(`Failed to fetch global state item ${item}, ${error}`);
    throw error;
  }
}

export async function getCurrentTeacher(refresh?: boolean): Promise<TeacherView> {
  return fetchItem<TeacherView>(GlobalState.Teacher, getCurrentTeacherView, refresh);
}

export async function getCuratingTeacher(refresh?: boolean): Promise<TeacherView> {
  return fetchItem<TeacherView>(GlobalState.CuratingTeacher, getCuratingTeacherView, refresh);
}

export async function getTasks(refresh?: boolean): Promise<TaskView[]> {
  return fetchItem<TaskView[]>(GlobalState.Tasks, getCurrentTeachersTasks, refresh);
}

export async function loadInitialState(): Promise<InitialState> {
  const [teacher, tasks] = await Promise.all([getCurrentTeacher(), getTasks()]);
  memory.setItem(GlobalState.isInitialStateLoaded, 'true');
  return { teacher, tasks };
}

export function isInitialStateLoaded(): boolean {
  return Boolean(memory.getItem(GlobalState.isInitialStateLoaded));
}

export async function refreshInitialState(): Promise<InitialState> {
  const [teacher, tasks] = await Promise.all([getCurrentTeacher(true), getTasks(true)]);
  return { teacher, tasks };
}
