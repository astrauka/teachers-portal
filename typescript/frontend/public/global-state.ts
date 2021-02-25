import {
  getAllAccountStatuses,
  getCuratingTeacherView,
  getCurrentTeacherView,
} from 'backend/backend-api';
import { memory } from 'wix-storage';
import { AccountStatus, TeacherView } from './common/entities/teacher';
import { InitialState } from './for-current-teacher';

enum GlobalState {
  Teacher = 'Teacher',
  CuratingTeacher = 'CuratingTeacher',
  AccountStatuses = 'AccountStatuses',
  InitialStateLoaded = 'InitialStateLoaded',
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
  memory.setItem(GlobalState.InitialStateLoaded, 'true');
  return { teacher };
}

export function InitialStateLoaded(): boolean {
  return Boolean(memory.getItem(GlobalState.InitialStateLoaded));
}

export async function refreshInitialState(): Promise<InitialState> {
  const teacher = await getCurrentTeacher(true);
  return { teacher };
}
