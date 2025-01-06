export const toArray = (value) => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

export const validateNumbersArray = (array) => {
  array = toArray(array);
  if (!array.every((value) => typeof value === 'number')) {
    throw new TypeError(`Todos os valores no array devem ser números:\n array: ${JSON.stringify(array)}`);
  }
  return array;
};

export const sumAllNumbersArray = (array) => {
  array = toArray(array);
  validateNumbersArray(array);
  const sum = array.reduce((total, value) => total + value, 0);
  return sum;
};

export const subtractOperation = (minuend, subtrahend) => {
  minuend = sumAllNumbersArray(minuend);
  subtrahend = sumAllNumbersArray(subtrahend);
  const difference = minuend - subtrahend;
  return difference;
};

export const divisionOperation = (dividend, divisor) => {
  dividend = sumAllNumbersArray(dividend);
  divisor = sumAllNumbersArray(divisor);
  if (divisor === 0) {
    throw new Error('Divisão por zero não é permitida.');
  }
  const quotient = dividend / divisor;
  return quotient;
};

export const multiplicationOperation = (factors) => {
  factors = validateNumbersArray(factors);
  const product = factors.reduce((total, value) => total * value, 1);
  return product;
};

export const calculatePercentage = (part, whole) => {
  part = sumAllNumbersArray(part);
  whole = sumAllNumbersArray(whole);
  if (whole === 0) {
    throw new Error('O total (whole) não pode ser zero ao calcular a porcentagem.');
  }
  const divisionResult = divisionOperation(part, whole);
  const percentage = multiplicationOperation([divisionResult, 100]);
  return percentage;
};
