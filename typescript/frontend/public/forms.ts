import { replace } from 'lodash';

export function idFromString(value: string, convert: (value: string) => string): string {
  return replace(convert(value), /[^A-Za-z0-9]/g, '0');
}
