import { isEmpty } from 'lodash';
import wixData from 'wix-data';

import WixDataFilter = wix_data.WixDataFilter;

export type FilterFromValues = [string | string[], (filter: WixDataFilter) => WixDataFilter];

export function getFilter(fieldFilterFunctions: FilterFromValues[]): WixDataFilter {
  return fieldFilterFunctions.reduce((filter, [value, operation]) => {
    if (isEmpty(value)) {
      return filter;
    } else {
      return operation(filter);
    }
  }, wixData.filter());
}
