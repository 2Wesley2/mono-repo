import Model from '../../../../core/entities/system/base/Model.js';
import { SHOW_ROOM, PRODUCT } from '../../../collections/index.js';
import loaders from '../../../../core/loaders/index.js';

const showRoomSchema = {
  products: [
    {
      product: { type: loaders.mongoose.getObjectId(), ref: PRODUCT, required: true },
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
