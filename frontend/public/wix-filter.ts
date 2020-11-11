import wixData from 'wix-data';
import { WixDataFilter } from '../wix-types';

type FilterFromValues = [string, (filter: WixDataFilter) => WixDataFilter];

export function getFilter(fieldFilterFunctions: FilterFromValues[]) {
  return fieldFilterFunctions.reduce((filter, [value, operation]) => {
    if (value) {
      return operation(filter);
    } else {
      return filter;
    }
  }, wixData.filter());
}
