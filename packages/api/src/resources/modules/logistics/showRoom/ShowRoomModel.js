import Model from '../../../../core/infrastructure/database/components/base/Model.js';
import { SHOW_ROOM, PRODUCT } from '../../../collections/index.js';
import loaders from '../../../../core/loaders/index.js';

const showRoomSchema = {
  products: [
    {
      product: { type: Model.objectIdType, ref: PRODUCT, required: true },
      quantity: { type: Number, required: true, validate: { validator: (v) => v >= 0 } },
    },
  ],
};

export default class ShowRoomModel extends Model {
  constructor() {
    super(showRoomSchema, SHOW_ROOM);
  }

  async updateManyProducts(idBackStock, updates) {
    const operations = updates.map(({ productId, quantity }) =>
      loaders.stock.createProductUpdateOperation(idBackStock, productId, quantity),
    );

    await this.model.bulkWrite(operations);
  }
}
