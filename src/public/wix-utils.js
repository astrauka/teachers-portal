import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
export function isLiveSite() {
    return wixWindow.viewMode === 'Site';
}
export function addWixLocationQueryParams(queryPrams) {
    wixLocation.queryParams.add(queryPrams);
}
export function getWixLocationQuery() {
    return wixLocation.query;
}
export async function loadFirstDatasetPage($dataset) {
    return new Promise((resolve) => {
        $dataset.onReady(async () => {
            resolve($dataset.loadPage(1));
        });
    });
}
