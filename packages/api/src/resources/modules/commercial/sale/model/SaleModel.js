import Model from '#core/infrastructure/components/base/Model.js';
import { SALE, PRODUCT, OWNER } from '../../../collections/index.js';

const baseSaleSchema = {
  ownerId: {
    type: Model.objectIdType,
    required: true,
    ref: OWNER,
  },
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
  amount: { type: Number, validate: { validator: (value) => value > 0 } },
};

export default class SaleModel extends Model {
  constructor(schema = {}, modelName = SALE, options = {}, middlewares = []) {
    const combinedSchema = { ...baseSaleSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async registerNewSale(data) {
    return await this.model.create(data);
  }
}
