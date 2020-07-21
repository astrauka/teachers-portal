import { Language } from '../../backend/types/language';
import { builder } from './builder';

export const buildLanguage = builder<Language>(id => ({
  _id: `${id}`,
  title: `${id}-title`,
  order: 2,
}));
