import { toArray } from './arrayHelper.js';

export const isString = (values) => {
  const array = toArray(values);
  return array.reduce((acc, item) => acc && typeof item === 'string' && item.trim() !== '', true);
};
