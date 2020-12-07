import { updateTeachersProfile } from 'backend/backend-api';
import { transform } from 'lodash';
import { forLoggedInUser } from 'public/for-logged-in-user';
$w.onReady(() => forLoggedInUser(async () => {
    const fields = {
        facebook: $w('#facebook'),
        instagram: $w('#instagram'),
        linkedIn: $w('#linkedIn'),
        about: $w('#about'),
    };
    $w('#submitButton').onClick(() => {
        const update = transform(fields, (acc, $input, field) => {
            acc[field] = $input.value;
        }, {});
        updateTeachersProfile(update);
    });
}));
