import Model from '../../../../core/infrastructure/components/base/Model.js';
import { CASH_REGISTER } from '../../../collections/index.js';
import loaders from '../../../../core/loaders/index.js';

const cashRegisterSchema = {
  currentBalance: { type: Number, required: true }
};

export default class CashRegisterModel extends Model {
  constructor() {
    super(cashRegisterSchema, CASH_REGISTER);
  }
  async findDocument() {
    const document = await this.model.findOne();
    return document;
  }
  async createCashRegister(initialBalance) {
    const existsCashRegister = await this.findDocument();
    if (existsCashRegister) {
      throw Error('Já existe um caixa, não é possível criar outro');
    }
    const createCashRegister = loaders.cashRegister.create(initialBalance);
    const saveCashRegister = await this.model.create(createCashRegister);
    return saveCashRegister;
  }

  async updateCurrentBalance(newValue) {
    const registerCash = await this.findDocument();
    if (!registerCash) {
      throw new Error('Nenhum caixa encontrado para atualizar o saldo.');
    }
    const result = await this.model.updateOne({ _id: registerCash._id }, { $set: { currentBalance: newValue } });
    return result;
  }
}
