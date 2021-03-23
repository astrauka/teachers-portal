import { Storable } from './storable';

export interface TeacherModule extends Storable {
  module: string;
  teacherId: string;
  moduleId: string;
  certificateExpirationDate: Date;
}

export interface Module extends Storable {
  title: string;
}
