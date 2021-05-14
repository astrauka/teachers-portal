import {
  getAllAccountStatuses,
  getCuratingTeacherView,
  getCurrentTeacherView,
} from 'backend/backend-api';
import { AccountStatus, TeacherView } from 'public/universal/entities/teacher';
import { memory } from 'wix-storage';

import { InitialState } from './for-current-teacher';

enum GlobalState {
  Teacher = 'teacher',
  CuratingTeacher = 'curatingTeacher',
  AccountStatuses = 'accountStatuses',
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

export async function getAccountStatuses(): Promise<AccountStatus[]> {
  return fetchItem<AccountStatus[]>(GlobalState.AccountStatuses, getAllAccountStatuses);
}

export async function loadInitialState(): Promise<InitialState> {
  const teacher = await getCurrentTeacher();
  memory.setItem(GlobalState.isInitialStateLoaded, 'true');
  return { teacher };
}

export function isInitialStateLoaded(): boolean {
  return Boolean(memory.getItem(GlobalState.isInitialStateLoaded));
}

export async function refreshInitialState(): Promise<InitialState> {
  const teacher = await getCurrentTeacher(true);
  return { teacher };
}
