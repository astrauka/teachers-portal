import { replace, transform } from 'lodash';

export function objectFromArray<T>(keys: string[], value: string = ''): T {
  return transform(
    keys,
    (acc, field) => {
      acc[field] = value;
    },
    {}
  ) as T;
}

export function idFromString(value: string): string {
  return replace(btoa(value), /[^A-Za-z0-9]/g, '0');
}
