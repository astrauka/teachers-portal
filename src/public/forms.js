import { replace } from 'lodash';
export function idFromString(value, convert) {
    return replace(convert(value), /[^A-Za-z0-9]/g, '0');
}
