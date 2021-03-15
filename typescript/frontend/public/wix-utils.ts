import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
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

export async function executeOnce($status: $w.Text, executeFn: () => any): Promise<void> {
  if ($status.text === EXECUTION_STATUS_LOADED) {
    return;
  }
  await executeFn();
  $status.text = EXECUTION_STATUS_LOADED;
}
