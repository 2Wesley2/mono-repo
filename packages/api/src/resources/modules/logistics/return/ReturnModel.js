import Model from '../../../../core/entities/system/base/Model.js';
import { RETURN, SALE, PRODUCT, TRADE_DISCOUNT, ALLOWANCE } from '../../../collections/index.js';

const returnSchema = {
  saleID: { type: Model.objectIdType, ref: SALE, required: true },
  returnedAmount: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value > 0,
      message: 'o valor retornado deve ser positivo',
    },
  },
  reasons: { type: String, required: true },
  productsDetails: [
    {
      productId: {
        type: Model.objectIdType,
        ref: PRODUCT,
      },
      quantity: {
        type: Number,
        required: true,
        validate: {
          validator: (value) => value > 0,
        },
      },
    },
  ],
};

export default class ReturnsModel extends Model {
  constructor() {
    super(returnSchema, RETURN);
  }
}
