import wixWindow from 'wix-window';

export function isLiveSite() {
    return wixWindow.viewMode === "Site";
}