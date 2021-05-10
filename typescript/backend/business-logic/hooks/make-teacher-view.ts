import { pick } from 'lodash';
import {
  Teacher,
  TeacherView,
  TEACHER_ALL_FIELDS,
  TEACHER_DEFAULTS,
  TEACHER_PUBLIC_FIELDS,
} from '../../universal/entities/teacher';

export type MakeTeacherView = ReturnType<typeof makeTeacherViewFactory>;

export function makeTeacherViewFactory() {
  return async function makeTeacherView(
    teacher: Teacher,
    { returnPrivateFields = false } = {}
  ): Promise<TeacherView> {
    const fieldsToPick = returnPrivateFields ? TEACHER_ALL_FIELDS : TEACHER_PUBLIC_FIELDS;
    return pick({ ...TEACHER_DEFAULTS, ...teacher }, fieldsToPick);
  };
}
