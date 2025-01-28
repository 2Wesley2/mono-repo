import Model from '../../../../core/infrastructure/components/base/Model.js';
import { RETURN, SALE, PRODUCT, OWNER } from '../../../collections/index.js';

const returnSchema = {
  ownerID: { type: Model.objectIdType, ref: OWNER, required: true },
  saleID: { type: Model.objectIdType, ref: SALE, required: true },
  returnedAmount: {
    type: Number,
    required: true,
    validate: {
      validator: function () {
        const totalCalculated = this.productsDetails.reduce((sum, item) => sum + item.quantity * item.productPrice, 0);
        return this.returnedAmount === totalCalculated;
      },
      message: 'O valor de returnedAmount deve ser igual ao preço total dos produtos devolvidos.',
    },
  },
  reasons: { type: String, required: true },
  productsDetails: [
    {
      productId: {
        type: Model.objectIdType,
        ref: PRODUCT,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        validate: {
          validator: (value) => value > 0,
          message: 'A quantidade devolvida deve ser maior que 0.',
        },
      },
      productPrice: {
        type: Number,
        required: true,
      },
    },
  ],
};

export default class ReturnsModel extends Model {
  constructor() {
    super(returnSchema, RETURN);
  }
}
