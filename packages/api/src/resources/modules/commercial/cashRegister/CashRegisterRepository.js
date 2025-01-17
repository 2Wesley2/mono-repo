import loaders from '../../../../loaders/index.js';

export default class CashRegisterReposioty {
  constructor(model) {
    this.model = model;
  }
  async inflow(cash) {
    const currentBalance = await this.model.getCurrentBalance();
    const newCurrentBalance = loaders.cashRegister.inflow(currentBalance, cash);
    if (newCurrentBalance < currentBalance) {
      throw Error('O novo valor contido no caixa deve ser maior que o anterior');
    }
    const updateCurrentBalance = await this.model.updateCurrentBalance(newCurrentBalance);
    return updateCurrentBalance;
  }
  async outflow(cash) {
    const currentBalance = await this.model.getCurrentBalance();
    const newCurrentBalance = loaders.cashRegister.outflow(currentBalance, cash);
    if (newCurrentBalance > currentBalance) {
      throw Error('O novo valor contido no caixa deve ser menor que o anterior');
    }
    const updateCurrentBalance = await this.model.updateCurrentBalance(newCurrentBalance);
    return updateCurrentBalance;
  }
}
