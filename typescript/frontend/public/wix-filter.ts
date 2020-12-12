import wixData from 'wix-data';
import { WixDataFilter } from './common/wix-types';

export type FilterFromValues = [string, (filter: WixDataFilter) => WixDataFilter];

export function getFilter(fieldFilterFunctions: FilterFromValues[]): WixDataFilter {
  return fieldFilterFunctions.reduce((filter, [value, operation]) => {
    if (value) {
      return operation(filter);
    } else {
      return filter;
    }
  }, wixData.filter());
}
