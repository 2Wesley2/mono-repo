import Model from '../../components/Model.js';
import loaders from '../../../loaders/index.js';
import { ORDER, PRODUCT } from '../../collections/index.js';
import {
  GenericError,
  NotFoundError,
  InvalidRequestError,
  ForbiddenError,
  ConflictError,
  UnprocessableEntityError,
} from '../../../errors/Exceptions.js';

/**
 * Valida a consistência da comanda.
 * Lança um erro se houver produtos na comanda, mas o valor total for menor ou igual a zero.
 * @throws {Error} Caso a validação falhe.
 */
const validateOrder = function () {
  if (this.products.length > 0 && this.totalAmount <= 0) {
    throw new InvalidRequestError([
      { field: 'totalAmount', message: 'O valor total deve ser maior que zero se houver produtos na comanda.' },
    ]);
  }
};

/**
 * Esquema do modelo da comanda no MongoDB.
 * Define a estrutura do documento, validações e referências.
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
   * Cria uma nova comanda no banco de dados.
   * @param {Object} data - Dados da comanda a ser criada.
   * @returns {Object} A comanda criada.
   */
  async createOrder(data) {
    return await this.model.create(data);
  }

  /**
   * Cria múltiplas comandas em lote.
   * @param {Object[]} data - Lista de dados das comandas a serem criadas.
   * @returns {Object[]} Lista de comandas criadas.
   */
  async bulkCreate(data) {
    return await this.model.insertMany(data);
  }

  /**
   * Atualiza os produtos e o valor total de uma ordem existente.
   * @param {string} orderId - ID da ordem.
   * @param {Object[]} updatedProducts - Lista de produtos atualizados.
   * @param {number} totalAmount - Valor total calculado.
   * @returns {Promise<Object>} Resultado da operação de atualização.
   */
  async updateOrderProducts(OrderId, updatedProducts, totalAmount) {
    const resultOfUpdate = await this.model.updateOne(
      { _id: OrderId },
      {
        $set: {
          status: 'In Progress',
          totalAmount,
          products: updatedProducts,
        },
      },
    );
    if (resultOfUpdate.matchedCount === 0) {
      throw new ConflictError([{ field: 'orderId', message: 'Nenhuma ordem encontrada para atualizar.' }]);
    }
    return resultOfUpdate;
  }

  /**
   * Busca uma comanda pelo número da comanda.
   * @param {number} orderNumber - Número da comanda.
   * @returns {Object} A comanda encontrada.
   * @throws {NotFoundError} Caso não encontre a comanda ou ocorra erro inesperado.
   */
  async findByOrderNumber(orderNumber) {
    const result = await this.model.findByUniqueKey({ orderNumber });
    if (!result) {
      throw new NotFoundError([{ field: 'orderNumber', message: 'Pedido não encontrado.' }]);
    }
    return result.toObject();
  }

  /**
   * Lista os produtos associados a uma comanda pelo número da comanda.
   * @param {number} orderNumber - Número da comanda.
   * @returns {Object} Informações sobre os produtos e o valor total da comanda.
   * @throws {NotFoundError} Caso a comanda não seja encontrada ou a estrutura de dados seja inválida.
   */
  async listProductsByOrder(orderNumber) {
    const order = await this.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError([{ field: 'orderNumber', message: 'Pedido não encontrado.' }]);
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
