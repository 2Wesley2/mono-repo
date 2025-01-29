import Model from '#src/core/infrastructure/components/base/Model.js';
import { OWNER, SUPPLIER, PRODUCT, PURCHASE } from '#resources/collections/index.js';

const purchaseSchema = {
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  supplierId: { type: Model.objectIdType, ref: SUPPLIER, required: true },
  products: [
    {
      productId: { type: Model.objectIdType, ref: PRODUCT, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
};

export default class PurchaseModel extends Model {
  constructor(schema = {}, modelName = PURCHASE, options = {}, middlewares = []) {
    const combinedSchema = { ...purchaseSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async createPurchase(purchaseData) {
    return await this.model.create(purchaseData);
  }

  async getPurchasesByOwner(ownerId) {
    return await this.model.find({ ownerId }).populate('supplierId products.productId').lean();
  }

  async getPurchasesBySupplier(supplierId) {
    return await this.model.find({ supplierId }).populate('ownerId products.productId').lean();
  }
}
