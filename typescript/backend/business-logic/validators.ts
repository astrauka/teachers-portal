import { Task } from '../common/entities/task';
import { TeachersInfo } from '../common/entities/teachers-info';
import {
  InitialTeacherForm,
  SecondStepTeachersForm,
  TeachersProfile,
} from '../common/entities/teachers-profile';
import { taskSchema } from '../common/schemas/task';
import { teachersInfoSchema } from '../common/schemas/teachers-info';
import {
  initialTeachersFormSchema,
  secondStepTeachersFormSchema,
  teachersProfileSchema,
} from '../common/schemas/teachers-profile';

import { buildValidator } from '../utils/validate';

export const validateTeachersProfile = buildValidator<TeachersProfile>(teachersProfileSchema);
export const validateInitialTeachersForm = buildValidator<InitialTeacherForm>(
  initialTeachersFormSchema
);
export const validateSecondStepTeachersForm = buildValidator<SecondStepTeachersForm>(
  secondStepTeachersFormSchema
);

export const validateTask = buildValidator<Task>(taskSchema);

export const validateTeachersInfo = buildValidator<TeachersInfo>(teachersInfoSchema);
