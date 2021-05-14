import { Module, TeacherModule } from '../../backend/universal/entities/teacher-module';
import { inDaysAsDate } from '../utils/date';

import { builder } from './builder';

export const buildTeacherModule = builder<TeacherModule>((id) => ({
  _id: `${id}`,
  module: `module-${id}`,
  teacherId: `teacher-id-${id}`,
  moduleId: `module-id-${id}`,
  certificateExpirationDate: inDaysAsDate(50),
}));

export const buildModule = builder<Module>((id) => ({
  _id: `${id}`,
  title: `module-${id}`,
}));
