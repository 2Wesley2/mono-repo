import MathOperations from './MathOperations.js';

export default class CashRegister extends MathOperations {
  constructor() {
    super();
  }
  static create(initialCurrentBalance) {
    initialCurrentBalance = this.isNumber(initialCurrentBalance);
    return { currentBalance: initialCurrentBalance };
  }

  static inflow(currentBalance, cash) {
    const values = [currentBalance, cash];
    const addValues = this.sumAllNumbersArray(values);
    return addValues;
  }

  static outflow(currentBalance, cash) {
    const subtractValues = this.subtractOperation(currentBalance, cash);
    return subtractValues;
  }
}
