import { v4 as generateV4Uuid } from 'uuid';

export type IdProvider = () => string;

export const generateUuid: IdProvider = () => generateV4Uuid();
