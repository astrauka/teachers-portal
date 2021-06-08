import { HookContext } from '../types/wix-types';

export function isOwner(context: HookContext): boolean {
  return context.userRole === 'siteOwner';
}
