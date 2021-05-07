import { omit } from 'lodash';
import { PRIVATE_TEACHER_FIELDS, PublicTeacher, Teacher } from '../../common/entities/teacher';

export function hidePrivateTeacherDataFactory() {
  return async function hidePrivateTeacherData(teacher: Teacher): Promise<PublicTeacher> {
    return omit(teacher, PRIVATE_TEACHER_FIELDS) as PublicTeacher;
  };
}
