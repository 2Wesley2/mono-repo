import Model from '../../core/Model.js';
import { CALCREF } from '../../constants/index.js';

const calcRefSchema = {
  baseValue: { type: Number, required: true },
  minimumRedeemAmount: { type: Number, required: true },
};

class CalcRefModel extends Model {
  constructor() {
    super(calcRefSchema, CALCREF);
  }

  async getBaseValue() {
    const document = await this.model.findOne();
    return document.baseValue;
  }

  async getMinimumRedeemAmount() {
    const document = await this.model.findOne();
    return document.minimumRedeemAmount;
  }
}

export default CalcRefModel;
