import { InitialTeacherForm, SecondStepTeachersForm, Teacher } from '../universal/entities/teacher';
import { TeacherModule } from '../universal/entities/teacher-module';
import { teacherModuleSchema } from '../universal/schemas/teacher-module-schemas';
import {
  initialTeachersFormSchema,
  secondStepTeachersFormSchema,
  teacherSchema,
} from '../universal/schemas/teacher-schemas';
import { buildValidator } from '../utils/validation';

export const validateInitialTeachersForm =
  buildValidator<InitialTeacherForm>(initialTeachersFormSchema);
export const validateSecondStepTeachersForm = buildValidator<SecondStepTeachersForm>(
  secondStepTeachersFormSchema
);
export const validateTeacher = buildValidator<Teacher>(teacherSchema, { strict: false });

export const validateTeacherModule = buildValidator<TeacherModule>(teacherModuleSchema, {
  strict: false,
});
