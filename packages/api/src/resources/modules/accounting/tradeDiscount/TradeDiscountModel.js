import Model from '../../../../core/entities/system/base/Model.js';
import { TRADE_DISCOUNT, CUSTOMER } from '../../collections/index.js';

const tradeDiscountSchema = {
  customerId: { type: Model.objectIdType, ref: CUSTOMER, required: true },
  percentage: {
    type: Number,
    required: true,
    validate: { validator: (value) => value > 0 && value <= 100 },
  },
  description: {
    type: String,
    required: false,
    maxlength: 255,
  },
};

export class TradeDiscountModel extends Model {
  constructor() {
    super(tradeDiscountSchema, TRADE_DISCOUNT);
  }

  async registerTradeDiscount(data) {
    await this.model.create(data);
  }
}
