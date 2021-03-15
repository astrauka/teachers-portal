import { forCurrentTeacher } from 'public/for-current-teacher';
import { registerReadMoreButtons } from 'public/read-more';

forCurrentTeacher('FAQ', async () => {
  registerReadMoreButtons(20);
});
