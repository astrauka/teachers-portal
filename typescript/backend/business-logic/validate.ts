import { Task } from '../common/entities/task';
import { InitialTeacherForm, SecondStepTeachersForm, Teacher } from '../common/entities/teacher';
import { taskSchema } from '../common/schemas/task-schemas';
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

export const validateTask = buildValidator<Task>(taskSchema, { strict: false });
