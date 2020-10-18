import wixData from 'wix-data';

export function getFilter(fieldValues) {
	return Object.entries(fieldValues).reduce((filter, [field, [value, operation]]) => {
        if (value) {
            return operation(filter);
        } else {
            return filter;
        }
    }, wixData.filter())
}
