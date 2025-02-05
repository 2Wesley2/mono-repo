import { toArray } from './arrayHelper.js';

export const isString = (values) => {
  const array = toArray(values);
  return array.reduce((acc, item) => acc && typeof item === 'string' && item.trim() !== '', true);
};

export const convertDatesToStrings = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = obj[key] instanceof Date ? obj[key].toISOString() : obj[key];
    return acc;
  }, {});
};
