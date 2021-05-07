import { pick } from 'lodash';
import { TEACHER_ALL_FIELDS, TEACHER_DEFAULTS, TEACHER_PUBLIC_FIELDS, } from '../../common/entities/teacher';
export function makeTeacherViewFactory() {
    return async function makeTeacherView(teacher, { returnPrivateFields = false } = {}) {
        const fieldsToPick = returnPrivateFields ? TEACHER_ALL_FIELDS : TEACHER_PUBLIC_FIELDS;
        return pick({ ...TEACHER_DEFAULTS, ...teacher }, fieldsToPick);
    };
}
