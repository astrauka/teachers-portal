import { forCurrentTeacher } from 'public/for-current-teacher';

forCurrentTeacher('crashingCode', () => {
  throw new Error('Something went wrong');
});
