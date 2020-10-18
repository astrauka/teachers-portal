import { RecordNotFoundError } from './errors';
export async function findSingleRecord(queryResultPromise) {
    return (await queryResultPromise).items[0];
}
export async function findSingleRecordOrThrow(queryResultPromise) {
    const item = findSingleRecord(queryResultPromise);
    if (item) {
        return item;
    }
    throw new RecordNotFoundError('Item not found in database');
}
export async function findById(externals, collection, id) {
    return externals.wixData.get(collection, id, { suppressAuth: true });
}
export async function fetchRecords(queryResultPromise) {
    return (await queryResultPromise).items;
}
