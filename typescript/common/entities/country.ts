import { Storable } from './storable';

export interface Country extends Storable {
  title: string;
  order: number;
}
