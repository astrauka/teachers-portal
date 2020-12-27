import { replace, transform } from 'lodash';
export function objectFromArray(keys, value = '') {
    return transform(keys, (acc, field) => {
        acc[field] = value;
    }, {});
}
export function idFromString(value) {
    return replace(btoa(value), /[^A-Za-z0-9]/g, '0');
}
