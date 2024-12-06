function formatCurrency(value) {
  if (value === null || value === undefined) return '';
  return value.toFixed(2).replace('.', ',');
}
export default formatCurrency;
