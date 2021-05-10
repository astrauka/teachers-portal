import { teacherModuleSchema } from '../universal/schemas/teacher-module-schemas';
import { initialTeachersFormSchema, secondStepTeachersFormSchema, teacherSchema, } from '../universal/schemas/teacher-schemas';
import { buildValidator } from '../utils/validation';
export const validateInitialTeachersForm = buildValidator(initialTeachersFormSchema);
export const validateSecondStepTeachersForm = buildValidator(secondStepTeachersFormSchema);
export const validateTeacher = buildValidator(teacherSchema, { strict: false });
export const validateTeacherModule = buildValidator(teacherModuleSchema, {
    strict: false,
});
