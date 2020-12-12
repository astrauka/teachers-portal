import { transform } from 'lodash';
export function objectFromArray(keys, value = '') {
    return transform(keys, (acc, field) => {
        acc[field] = value;
    }, {});
}
