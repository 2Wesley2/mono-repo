export default class MathOperations {
  static toArray(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  }

  static isNumber(number) {
    return typeof number === 'number' && !Number.isNaN(number);
  }
  static validateNumbersArray(array) {
    array = this.toArray(array);
    if (array.length === 0) {
      throw new Error('O array não pode estar vazio.');
    }
    if (!array.every((value) => this.isNumber(value))) {
      throw new TypeError(`Todos os valores no array devem ser números:\n array: ${JSON.stringify(array)}`);
    }
    return array;
  }

  static sumAllNumbersArray(array) {
    array = this.toArray(array);
    this.validateNumbersArray(array);
    const sum = array.reduce((total, value) => total + value, 0);
    return sum;
  }

  static subtractOperation(minuend, subtrahend) {
    minuend = this.sumAllNumbersArray(minuend);
    subtrahend = this.sumAllNumbersArray(subtrahend);
    const difference = minuend - subtrahend;
    return difference;
  }

  static divisionOperation(dividend, divisor = 1) {
    dividend = this.sumAllNumbersArray(dividend);
    divisor = this.sumAllNumbersArray(divisor);
    if (divisor === 0) throw new Error('Divisão por zero não é permitida.');
    const quotient = dividend / divisor;
    return quotient;
  }

  static multiplicationOperation(factors) {
    factors = this.validateNumbersArray(factors);
    const product = factors.reduce((total, value) => total * value, 1);
    return product;
  }

  static calculatePercentage(part, whole) {
    part = this.sumAllNumbersArray(part);
    whole = this.sumAllNumbersArray(whole);
    if (whole === 0) {
      throw new Error('O total (whole) não pode ser zero ao calcular a porcentagem.');
    }
    const divisionResult = this.divisionOperation(part, whole);
    const percentage = this.multiplicationOperation([divisionResult, 100]);
    return percentage;
  }
}
