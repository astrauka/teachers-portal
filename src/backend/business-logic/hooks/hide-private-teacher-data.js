import { omit } from 'lodash';
import { PRIVATE_TEACHER_FIELDS } from '../../common/entities/teacher';
export function hidePrivateTeacherDataFactory() {
    return async function hidePrivateTeacherData(teacher) {
        return omit(teacher, PRIVATE_TEACHER_FIELDS);
    };
}
