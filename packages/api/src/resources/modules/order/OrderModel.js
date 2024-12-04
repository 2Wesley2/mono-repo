import Model from '../../core/Model.js';
import loaders from '../../../loaders/index.js';
import { ORDER, PRODUCT } from '../../constants/index.js';
import { calculateTotalAmount } from '../../../utils/order/index.js';
import AppError from '../../../errors/AppError.js';
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

  async updateOrderProducts(
    updatedProducts,
    currentOrderId,
    getExistingProducts,
    currentOrderTotalAmount,
    currentOrderProducts,
  ) {
    const totalAmount = calculateTotalAmount(
      getExistingProducts,
      updatedProducts,
      currentOrderTotalAmount,
      currentOrderProducts,
    );
    const resultOfUpdate = await this.model.updateOne(
      { _id: currentOrderId },
      {
        $set: {
          status: 'In Progress',
          totalAmount: totalAmount,
          products: updatedProducts,
        },
      },
    );
    console.log('resultOfUpdate na camada model', resultOfUpdate);
    return resultOfUpdate;
  }

  async findByOrderNumber(orderNumber) {
    const result = await this.model.findByUniqueKey({ orderNumber });
    if (!result) {
      throw new AppError(500, 'Erro desconhecido ao buscar o pedido.');
    }
    return result.toObject();
  }

  async listProductsByOrder(orderNumber) {
    const order = await this.findByOrderNumber(orderNumber);
    if (!order) {
      throw new AppError(404, 'Pedido não encontrado.');
    }
    if (!Array.isArray(order.products)) {
      throw new AppError(500, 'Estrutura de dados inesperada: "order.products" não é um array.');
    }

    return {
      totalAmount: order.totalAmount,
      products: order.products.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
    };
  }
}

export default OrderModel;
