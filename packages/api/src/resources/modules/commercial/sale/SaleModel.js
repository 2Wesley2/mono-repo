import Model from '../../../../core/infrastructure/database/components/base/Model.js';
import {
  SALE,
  POS_SALE,
  ONLINE_SALE,
  CUSTOMER,
  PRODUCT,
  TRADE_DISCOUNT,
  ALLOWANCE,
} from '../../../collections/index.js';

const validSalesTypes = [POS_SALE, ONLINE_SALE];

async function validateAllowanceOnCreate(next) {
  if (this.isNew && this.allowance !== null) {
    return next(new Error('Allowance não pode ser definido durante a criação de um documento Sale.'));
  }
  next();
}

async function preventTradeDiscountModification(next) {
  const update = this.getUpdate();
  const existingDoc = await this.model.findOne(this.getQuery());

  if (update.tradeDiscount && existingDoc.tradeDiscount?.toString() !== update.tradeDiscount.toString()) {
    return next(new Error('TradeDiscount não pode ser alterado após a criação.'));
  }
  next();
}

const saleSchema = {
  customerId: { type: Model.objectIdType(), ref: CUSTOMER, required: false },
  type: {
    type: Model.objectIdType,
    required: true,
    refPath: 'typeRef',
  },
  typeRef: { type: String, required: true, enum: [...validSalesTypes] },
  items: [
    {
      productId: {
        type: Model.objectIdType,
        ref: PRODUCT,
        required: true,
      },
      quantity: { type: Number, validate: { validator: (value) => value > 0 } },
    },
  ],
  tradeDiscount: {
    type: Model.objectIdType(),
    ref: TRADE_DISCOUNT,
    default: null,
  },
  allowance: {
    type: Model.objectIdType(),
    ref: ALLOWANCE,
    default: null,
  },
  amount: { type: Number, validate: { validator: (value) => value > 0 } },
};

export default class SaleModel extends Model {
  constructor() {
    super(saleSchema, SALE, {}, [
      { type: 'pre', event: 'save', fn: validateAllowanceOnCreate },
      { type: 'pre', event: 'findOneAndUpdate', fn: preventTradeDiscountModification },
    ]);
  }

  async registerNewSale(data) {
    await this.model.create(data);
  }
}
