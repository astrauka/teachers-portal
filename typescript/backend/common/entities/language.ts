import { Storable } from './storable';

export interface Language extends Storable {
  title: string;
  order: number;
}
