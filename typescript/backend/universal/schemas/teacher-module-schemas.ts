import { ValidationSchema } from 'fastest-validator';
import { TeacherModule } from '../entities/teacher-module';

export const teacherModuleSchema: ValidationSchema<TeacherModule> = {
  _id: { type: 'string', min: 3, max: 255, optional: true },
  module: { type: 'string', min: 3, optional: true },
  teacherId: { type: 'string', min: 3, max: 255 },
  moduleId: { type: 'string', min: 3, max: 255 },
  certificateExpirationDate: { type: 'date', optional: true },
};
