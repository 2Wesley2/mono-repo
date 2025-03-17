export const toArray = (value: any) => {
  if (value == null || value == undefined) return [];
  return Array.isArray(value) ? value : [value];
};
