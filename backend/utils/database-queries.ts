import { Externals } from '../context/production-context';
import { WixDataQueryReferencedResult, WixDataQueryResult } from '../types/wix-types';
import { RecordNotFoundError } from './errors';

export async function findSingleRecordSafe<T>(
  queryResultPromise: Promise<WixDataQueryResult>
): Promise<T | undefined> {
  const item = (await queryResultPromise).items[0];
  if (item) {
    return item;
  }
  throw new RecordNotFoundError('Item not found in database');
}

export async function findSingleRecord<T>(
  queryResultPromise: Promise<WixDataQueryResult>
): Promise<T> {
  return (await queryResultPromise).items[0];
}

export async function findById<T>(externals: Externals, collection, id): Promise<T> {
  return externals.wixData.get(collection, id, { suppressAuth: true });
}

export async function fetchRecords<T>(
  queryResultPromise: Promise<WixDataQueryResult | WixDataQueryReferencedResult>
): Promise<T[]> {
  return (await queryResultPromise).items;
}
