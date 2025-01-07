import Model from '../../components/Model.js';
import { CASHREGISTER, SESSION } from '../../constants/index.js';
import loaders from '../../../loaders/index.js';
import CashRegister from '../../finance/components/CashRegister.js';

const cashRegisterSchema = {
  currentBalance: { type: Number, required: true },
  // session: { type: loaders.mongoose.getObjectId(), ref: SESSION, required: true },
};

export default class CashRegisterModel extends Model {
  constructor() {
    super(cashRegisterSchema, CASHREGISTER);
  }
  async findDocument() {
    const document = await this.model.findOne({});
    return document;
  }
  async createCashRegister(initialBalance) {
    const existsCashRegister = await this.findDocument();
    if (existsCashRegister) {
      throw Error('Já existe um caixa, não é possível criar outro');
    }
    const createCashRegister = new CashRegister.create(initialBalance);
    const saveCashRegister = this.model.create(createCashRegister);
    return saveCashRegister;
  }
}
