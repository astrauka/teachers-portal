import { range } from 'lodash';
import { forExistingElement } from './wix-utils';

export function registerReadMoreButtons(buttonsCount: number) {
  range(1, buttonsCount).forEach((nr: number) => {
    forExistingElement(
      $w(`#readMoreBox${nr}` as WixElementSelector) as $w.MultiStateBox,
      ($readMoreBox) => {
        $w(`#readMoreButton${nr}` as 'Button').onClick(() => {
          $readMoreBox.changeState(`expanded${nr}`);
        });
        $w(`#readLessButton${nr}` as `Button`).onClick(() => {
          $readMoreBox.changeState(`collapsed${nr}`);
        });
      }
    );
  });
}
