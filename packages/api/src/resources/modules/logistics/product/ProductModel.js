import Model from '../../../../core/infrastructure/components/base/Model.js';
import { PRODUCT, OWNER, SALE, PURCHASE } from '../../../collections/index.js';
import product from '#src/core/entities/domain/product/Product.js';

const CATEGORIES = Object.freeze(['REFEIÇÕES', 'GERAL', 'BEBIDAS', 'SALGADOS', 'LANCHES']);
const productSchema = {
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  barcode: { type: String, unique: true, required: true },
  sku: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  type: { type: String, enum: ['ready_to_sell', 'made_in_house'], required: true },
  quantityInStock: {
    type: Number,
    required: function () {
      return this.type === 'ready_to_sell';
    },
    validate: {
      validator: function (v) {
        return this.type === 'made_in_house' || v >= 0;
      },
      message: 'Quantity cannot be negative for "ready_to_sell" products',
    },
  },
  category: { type: String, enum: CATEGORIES },
  sales: [{ type: Model.objectIdType, ref: SALE }],
  purchases: [{ type: Model.objectIdType, ref: PURCHASE }],
};

export default class ProductModel extends Model {
  constructor(schema = {}, modelName = PRODUCT, options = {}, middlewares = []) {
    const combinedSchema = { ...productSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async createProduct(data) {
    return await this.model.create(data);
  }

  async bulkCreate(productList) {
    return await this.model.insertMany(productList);
  }

  async getProductsCategories(ownerId) {
    const { filter, projection } = product.filterByCategories(ownerId);
    return await this.model.find(filter, projection);
  }

  async searchProducts(ownerId, q) {
    const { filter } = product.filterBySearch(ownerId, q);
    return await this.model.find(filter);
  }

  async deleteProduct(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
