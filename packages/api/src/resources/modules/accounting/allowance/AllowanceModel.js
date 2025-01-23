import Model from '../../../../core/infrastructure/components/base/Model.js';
import { ALLOWANCE, TRADE_DISCOUNT, CUSTOMER, SALE } from '../../collections/index.js';

const allowanceSchema = {
  saleId: { type: Model.objectIdType, ref: SALE, required: true },
  customerId: { type: Model.objectIdType, ref: CUSTOMER, required: false },
  amount: {
    type: Number,
    required: true,
    validate: { validator: (value) => value > 0 },
  },
  reason: {
    type: String,
    required: true,
  },
};

export class AllowanceModel extends Model {
  constructor() {
    super(allowanceSchema, ALLOWANCE);
  }

  async registerAllowance(data) {
    await this.model.create(data);
  }
}
