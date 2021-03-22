import { InitialTeacherForm, SecondStepTeachersForm, Teacher } from '../common/entities/teacher';
import { TeacherModule } from '../common/entities/teacher-module';
import { teacherModuleSchema } from '../common/schemas/teacher-module-schemas';
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

export const validateTeacherModule = buildValidator<TeacherModule>(teacherModuleSchema, {
  strict: false,
});
