import { toArray } from './arrayHelper.js';

export const isString = (value) => {
  const array = toArray(value);
  return array.every((item) => typeof item === 'string' || item instanceof String);
};
