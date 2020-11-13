import { WixDataQueryReferencedResult, WixDataQueryResult } from '../../common/types/wix-types';
import { Externals } from '../context/production-context';
import { RecordNotFoundError } from './errors';

export async function findSingleRecord<T>(
  queryResultPromise: Promise<WixDataQueryResult>
): Promise<T | undefined> {
  return (await queryResultPromise).items[0];
}

export async function findSingleRecordOrThrow<T>(
  queryResultPromise: Promise<WixDataQueryResult>
): Promise<T> {
  const item = findSingleRecord<T>(queryResultPromise);
  if (item) {
    return item;
  }
  throw new RecordNotFoundError('Item not found in database');
}

export async function findById<T>(externals: Externals, collection, id): Promise<T> {
  return externals.wixData.get(collection, id, { suppressAuth: true });
}

export async function fetchRecords<T>(
  queryResultPromise: Promise<WixDataQueryResult | WixDataQueryReferencedResult>
): Promise<T[]> {
  return (await queryResultPromise).items;
}
