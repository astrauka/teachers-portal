import { isEmpty } from 'lodash';
import wixData from 'wix-data';
export function getFilter(fieldFilterFunctions) {
    return fieldFilterFunctions.reduce((filter, [value, operation]) => {
        if (isEmpty(value)) {
            return filter;
        }
        else {
            return operation(filter);
        }
    }, wixData.filter());
}
