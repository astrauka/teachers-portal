import { range } from 'lodash';
import { forExistingElement } from './wix-utils';
export function registerReadMoreButtons(buttonsCount) {
    range(1, buttonsCount).forEach((nr) => {
        forExistingElement($w(`#readMoreBox${nr}`), ($readMoreBox) => {
            $w(`#readMoreButton${nr}`).onClick(() => {
                $readMoreBox.changeState(`expanded${nr}`);
            });
            $w(`#readLessButton${nr}`).onClick(() => {
                $readMoreBox.changeState(`collapsed${nr}`);
            });
        });
    });
}
