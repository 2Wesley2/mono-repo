import { toArray } from './arrayHelper.js';

export const isString = (value) => {
  const array = toArray(value);
  return array.every((item) => typeof item === 'string' || item instanceof String);
};

export const toStrings = (array) => {
  const arr = toArray(array);
  return array.map((value) => (value !== null && value !== undefined ? value.toString() : String(value)));
};
