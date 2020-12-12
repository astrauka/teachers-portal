import { Task } from '../common/entities/task';
import { TeachersInfo } from '../common/entities/teachers-info';
import { TeachersProfile } from '../common/entities/teachers-profile';
import { taskSchema } from '../common/schemas/task';
import { teachersInfoSchema } from '../common/schemas/teachers-info';
import {
  teachersProfileSchema,
  teachersProfileUpdateSchema,
} from '../common/schemas/teachers-profile';

import { buildValidator } from '../utils/validate';

export const validateTeachersProfile = buildValidator<TeachersProfile>(teachersProfileSchema);
export const validateTeachersProfileUpdate = buildValidator<Partial<TeachersProfile>>(
  teachersProfileUpdateSchema
);

export const validateTask = buildValidator<Task>(taskSchema);

export const validateTeachersInfo = buildValidator<TeachersInfo>(teachersInfoSchema);
