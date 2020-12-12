import { updateTeachersProfile } from 'backend/backend-api';
import { transform } from 'lodash';
import { forLoggedInUser } from 'public/for-logged-in-user';

$w.onReady(() =>
  forLoggedInUser(async () => {
    const fields = {
      facebook: $w('#facebook' as 'TextInput'),
      instagram: $w('#instagram' as 'TextInput'),
      linkedIn: $w('#linkedIn' as 'TextInput'),
      about: $w('#about' as 'RichTextBox'),
    };
    $w('#submitButton' as 'Button').onClick(() => {
      const update = transform(
        fields,
        (acc, $input, field) => {
          acc[field] = $input.value;
        },
        {}
      );
      // updateTeachersProfile(update);
    });
  })
);
