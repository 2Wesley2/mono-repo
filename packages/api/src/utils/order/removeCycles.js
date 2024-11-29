function removeCycles(obj, seen = new WeakSet()) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (seen.has(obj)) return '[Circular]';

  seen.add(obj);

  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    result[key] = removeCycles(obj[key], seen);
  }
  seen.delete(obj);
  return result;
}
export default removeCycles;
