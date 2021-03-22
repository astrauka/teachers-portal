import { Externals } from '../context/production-context';
import { WixDataQueryReferencedResult, WixDataQueryResult } from '../types/wix-types';
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

export async function findById<T>(externals: Externals, collection, id): Promise<T | undefined> {
  if (id) {
    return externals.wixData.get(collection, id, { suppressAuth: true });
  }
  return undefined;
}

export async function findByIdOrThrow<T>(externals: Externals, collection, id): Promise<T> {
  const item = findById<T>(externals, collection, id);
  if (item) {
    return item;
  }
  throw new RecordNotFoundError(`Item by id: ${id} not found`);
}

export async function fetchRecords<T>(
  queryResultPromise: Promise<WixDataQueryResult | WixDataQueryReferencedResult>
): Promise<T[]> {
  return (await queryResultPromise).items;
}
