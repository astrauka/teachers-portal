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
