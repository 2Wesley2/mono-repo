import CashRegister from '../resources/entities/domain/financial/components/CashRegister.js';

export default {
  create: (...args) => CashRegister.create(...args),
  inflow: (...args) => CashRegister.inflow(...args),
  outflow: (...args) => CashRegister.outflow(...args),
};
