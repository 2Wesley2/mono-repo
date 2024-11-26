import Model from '../../core/Model.js';
import loaders from '../../../loaders/index.js';
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

  /**
   * Cria um novo pedido no banco de dados.
   * @param {Object} data - Dados do pedido a ser criado.
   * @returns {Promise<Object>} O pedido criado.
   */
  async createOrder(data) {
    return await this.model.create(data);
  }

  /**
   * Cria vários pedidos no banco de dados.
   * @param {Object[]} data - Array de objetos contendo os dados dos pedidos.
   * @returns {Promise<Object[]>} Os pedidos criados.
   */
  async bulkCreate(data) {
    return await this.model.insertMany(data);
  }

  /**
   * Encontra um pedido pelo número do pedido.
   * @param {Object} filter - Filtro com o campo único.
   * @returns {Promise<Object|null>} - Pedido encontrado ou `null`.
   */
  async findByOrderNumber(orderNumber) {
    return await this.model.findByUniqueKey(orderNumber);
  }

  /**
   * Atualiza um pedido pelo número do pedido.
   * @param {Object} filter - Filtro com o campo único.
   * @param {Object} updateFields - Campos a atualizar.
   * @returns {Promise<Object|null>} - Pedido atualizado ou `null`.
   */
  async updateByOrderNumber(orderNumber, updateFields) {
    const order = await this.findByOrderNumber(orderNumber);
    if (!order) {
      throw new Error(`Order with orderNumber ${orderNumber} not found`);
    }

    Object.assign(order, updateFields);
    return await order.save();
  }

  /**
   * Lista os produtos de um pedido específico.
   * @param {number} orderNumber - O número do pedido.
   * @returns {Promise<Object[]>} Lista de produtos do pedido.
   * @throws {Error} Lança erro se o pedido não for encontrado.
   */
  async listProductsByOrder(orderNumber) {
    const order = await this.findByOrderNumber(orderNumber);

    if (!order) {
      throw new Error(`Order with orderNumber ${orderNumber} not found`);
    }

    const products = await order.populate('products.product', 'name price');
    return products.products;
  }
}

export default OrderModel;
