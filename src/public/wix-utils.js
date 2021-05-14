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
export function forExistingElement($element, executeFn) {
    if (getElementWhenExists($element)) {
        return executeFn($element);
    }
}
const EXECUTION_STATUS_LOADED = 'loaded';
export async function executeOnce($status, executeFn) {
    if ($status.text === EXECUTION_STATUS_LOADED) {
        return;
    }
    const result = await executeFn();
    $status.text = EXECUTION_STATUS_LOADED;
    return result;
}
export function expandIfHasData($element, data) {
    if (data) {
        $element.expand();
    }
    else {
        $element.collapse();
    }
}
export function showEnabledElement($enabledElement, $disabledElement, data) {
    if (data) {
        $enabledElement.show();
        $disabledElement.hide();
    }
    else {
        $disabledElement.show();
        $enabledElement.hide();
    }
}
export function expandEnabledElement($enabledElement, $disabledElement, data) {
    if (data) {
        $enabledElement.expand();
        $disabledElement.collapse();
    }
    else {
        $disabledElement.expand();
        $enabledElement.collapse();
    }
}
