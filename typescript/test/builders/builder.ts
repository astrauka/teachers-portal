import { isUndefined, omit, omitBy } from 'lodash';
import { v4 as uuid } from 'uuid';

export function builder<T>(defaultProperties: (id: string) => T) {
  return function ({
    id = uuid().substring(0, 3),
    properties = {},
    without,
  }: {
    id?: string;
    properties?: Partial<T>;
    without?: (keyof T)[];
  } = {}) {
    return omit(omitBy({ ...defaultProperties(id), ...properties }, isUndefined), without) as T;
  };
}
