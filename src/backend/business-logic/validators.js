import { taskSchema } from '../common/schemas/task';
import { teachersInfoSchema } from '../common/schemas/teachers-info';
import { initialTeachersFormSchema, secondStepTeachersFormSchema, teachersProfileSchema, } from '../common/schemas/teachers-profile';
import { buildValidator } from '../utils/validate';
export const validateTeachersProfile = buildValidator(teachersProfileSchema);
export const validateInitialTeachersForm = buildValidator(initialTeachersFormSchema);
export const validateSecondStepTeachersForm = buildValidator(secondStepTeachersFormSchema);
export const validateTask = buildValidator(taskSchema);
export const validateTeachersInfo = buildValidator(teachersInfoSchema);
