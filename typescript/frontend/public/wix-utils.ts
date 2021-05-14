import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

import CollapsedMixin = $w.CollapsedMixin;
import HiddenMixin = $w.HiddenMixin;
import QueryObject = wix_location.QueryObject;

export type WixLocationQueryParams = { [param: string]: string };

export function isLiveSite(): boolean {
  return wixWindow.viewMode === 'Site';
}

export function addWixLocationQueryParams(queryPrams: WixLocationQueryParams): void {
  wixLocation.queryParams.add(queryPrams as QueryObject);
}

export function getWixLocationQuery(): WixLocationQueryParams {
  return wixLocation.query;
}

export async function loadFirstDatasetPage<T>($dataset): Promise<T[]> {
  return new Promise((resolve) => {
    $dataset.onReady(async () => {
      resolve($dataset.loadPage(1));
    });
  });
}

export function getExistingElement<Element extends { id: string }>(
  $element: Element,
  $fallbackElement: Element
): Element {
  return getElementWhenExists($element) || $fallbackElement;
}

export function getElementWhenExists<Element extends { id: string }>(
  $element: Element
): Element | undefined {
  return $element.id ? $element : undefined;
}

export function forExistingElement<Element extends { id: string }, Returned>(
  $element: Element,
  executeFn: ($element: Element) => Returned
) {
  if (getElementWhenExists<Element>($element)) {
    return executeFn($element);
  }
}

const EXECUTION_STATUS_LOADED = 'loaded';

export async function executeOnce<T>($status: $w.Text, executeFn: () => T): Promise<T> {
  if ($status.text === EXECUTION_STATUS_LOADED) {
    return;
  }
  const result = await executeFn();
  $status.text = EXECUTION_STATUS_LOADED;
  return result;
}

export function expandIfHasData($element: CollapsedMixin, data: unknown): void {
  if (data) {
    $element.expand();
  } else {
    $element.collapse();
  }
}

export function showEnabledElement(
  $enabledElement: HiddenMixin,
  $disabledElement: HiddenMixin,
  data: unknown
): void {
  if (data) {
    $enabledElement.show();
    $disabledElement.hide();
  } else {
    $disabledElement.show();
    $enabledElement.hide();
  }
}

export function expandEnabledElement(
  $enabledElement: CollapsedMixin,
  $disabledElement: CollapsedMixin,
  data: unknown
): void {
  if (data) {
    $enabledElement.expand();
    $disabledElement.collapse();
  } else {
    $disabledElement.expand();
    $enabledElement.collapse();
  }
}
