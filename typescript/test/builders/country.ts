import { Country } from '../../common/entities/country';
import { builder } from './builder';

export const buildCountry = builder<Country>((id) => ({
  _id: `${id}`,
  title: `${id}-title`,
  order: 2,
}));
