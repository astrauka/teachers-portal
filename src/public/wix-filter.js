import wixData from 'wix-data';
export function getFilter(fieldFilterFunctions) {
    return fieldFilterFunctions.reduce((filter, [value, operation]) => {
        if (value) {
            return operation(filter);
        }
        else {
            return filter;
        }
    }, wixData.filter());
}
