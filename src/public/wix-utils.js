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
export function getExistingElement($element, $fallbackElement) {
    return getElementWhenExists($element) || $fallbackElement;
}
export function getElementWhenExists($element) {
    return $element.id ? $element : undefined;
}
const EXECUTION_STATUS_LOADED = 'loaded';
export async function executeOnce($status, executeFn) {
    if ($status.text === EXECUTION_STATUS_LOADED) {
        return;
    }
    await executeFn();
    $status.text = EXECUTION_STATUS_LOADED;
}
