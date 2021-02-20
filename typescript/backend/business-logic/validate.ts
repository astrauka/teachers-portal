import { InitialTeacherForm, SecondStepTeachersForm, Teacher } from '../common/entities/teacher';
import {
  initialTeachersFormSchema,
  secondStepTeachersFormSchema,
  teacherSchema,
} from '../common/schemas/teacher-schemas';

import { buildValidator } from '../utils/validation';

export const validateInitialTeachersForm = buildValidator<InitialTeacherForm>(
  initialTeachersFormSchema
);
export const validateSecondStepTeachersForm = buildValidator<SecondStepTeachersForm>(
  secondStepTeachersFormSchema
);
export const validateTeacher = buildValidator<Teacher>(teacherSchema, { strict: false });
