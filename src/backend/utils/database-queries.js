import { RecordNotFoundError } from './errors';
export async function findSingleRecordSafe(queryResultPromise) {
    const item = (await queryResultPromise).items[0];
    if (item) {
        return item;
    }
    throw new RecordNotFoundError('Item not found in database');
}
export async function findSingleRecord(queryResultPromise) {
    return (await queryResultPromise).items[0];
}
export async function findById(externals, collection, id) {
    return externals.wixData.get(collection, id, { suppressAuth: true });
}
export async function fetchRecords(queryResultPromise) {
    return (await queryResultPromise).items;
}
