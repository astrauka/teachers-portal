import { taskSchema } from '../common/schemas/task';
import { teachersInfoSchema } from '../common/schemas/teachers-info';
import { initialTeachersFormSchema, teachersProfileSchema, } from '../common/schemas/teachers-profile';
import { buildValidator } from '../utils/validate';
export const validateTeachersProfile = buildValidator(teachersProfileSchema);
export const validateTeachersProfileUpdate = buildValidator(initialTeachersFormSchema);
export const validateTask = buildValidator(taskSchema);
export const validateTeachersInfo = buildValidator(teachersInfoSchema);
