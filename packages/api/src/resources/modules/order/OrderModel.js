import Model from '../../core/Model.js';
import loaders from '../../../loaders/index.js';
import debug from '../../../debug/index.js';
import { ORDER, PRODUCT } from '../../constants/index.js';

const validateOrder = function () {
  if (this.products.length > 0 && this.totalAmount <= 0) {
    throw new Error('Total amount must be greater than zero if there are products.');
  }
};

/**
 * Definição do schema do pedido no MongoDB.
 * @type {Object}
 */
const orderSchema = {
  orderNumber: { type: Number, unique: true, required: true },
  status: { type: String, enum: ['Stand By', 'In Progress'], default: 'Stand By' },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
      message: 'Total amount cannot be negative',
    },
  },
  products: [
    {
      product: { type: loaders.mongoose.getObjectId(), ref: PRODUCT, required: true },
      quantity: {
        type: Number,
        required: true,
        validate: {
          validator: (v) => v > 0,
          message: 'Product quantity must be greater than zero',
        },
      },
    },
  ],
};

/**
 * Classe responsável por gerenciar a lógica de negócios do modelo de pedidos.
 * Fornece métodos para criação, busca, atualização e exclusão de pedidos.
 * @class OrderModel
 */
class OrderModel extends Model {
  constructor() {
    super(orderSchema, ORDER, {}, [validateOrder]);
  }
  async createOrder(data) {
    return await this.model.create(data);
  }

  async bulkCreate(data) {
    return await this.model.insertMany(data);
  }

  async updateOrderProducts(updatedProducts, currentOrderId) {
    const resultOfUpdate = await this.model.updateOne(
      { _id: currentOrderId },
      {
        $set: {
          products: updatedProducts,
        },
      },
    );
    return resultOfUpdate;
  }

  async findByOrderNumber(orderNumber) {
    const result = await this.model.findByUniqueKey({ orderNumber });
    if (typeof result === 'string') {
      return result;
    }
    if (!result) {
      return 'Erro desconhecido ao buscar o pedido.';
    }
    return result.toObject();
  }

  async listProductsByOrder(orderNumber) {
    const result = await this.findByOrderNumber(orderNumber);
    if (typeof result === 'string') {
      return result;
    }
    if (result && Array.isArray(result.products)) {
      return result.products.map(({ product, quantity }) => ({ product, quantity }));
    }
    return 'Erro ao processar os produtos do pedido.';
  }
}

export default OrderModel;
