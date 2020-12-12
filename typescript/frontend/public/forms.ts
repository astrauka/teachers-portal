import { transform } from 'lodash';

export function objectFromArray<T>(keys: string[], value: string = ''): T {
  return transform(
    keys,
    (acc, field) => {
      acc[field] = value;
    },
    {}
  ) as T;
}
