import { forCurrentTeacher } from 'public/for-current-teacher';
forCurrentTeacher(() => {
    throw new Error('Something went wrong');
});
