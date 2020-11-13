import { WixHookContext } from '../../backend/types/wix-types';

export function buildHookContext<T>(collectionName: string, currentItem: T): WixHookContext<T> {
  return {
    currentItem,
    collectionName,
    userId: 'user-id',
    userRole: 'user-role',
  };
}
