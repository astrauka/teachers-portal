import { initialTeachersFormSchema, secondStepTeachersFormSchema, teacherSchema, } from '../common/schemas/teacher-schemas';
import { buildValidator } from '../utils/validation';
export const validateInitialTeachersForm = buildValidator(initialTeachersFormSchema);
export const validateSecondStepTeachersForm = buildValidator(secondStepTeachersFormSchema);
export const validateTeacher = buildValidator(teacherSchema, { strict: false });
