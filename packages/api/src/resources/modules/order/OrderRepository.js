import debug from '../../../debug/index.js';
import OrderModel from './OrderModel.js';
/**
 * Classe responsável por interagir com o modelo de pedidos (OrderModel).
 * Centraliza a lógica de repositório e facilita o gerenciamento de dados de pedidos.
 * @class OrderRepository
 */
class OrderRepository {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async createOrder(data) {
    return await this.orderModel.create(data);
  }

  async bulkCreate(data) {
    return await this.orderModel.bulkCreate(data);
  }

  async updateByOrderNumber(orderNumber, updateFields) {
    return await this.orderModel.updateByOrderNumber(orderNumber, updateFields);
  }

  async listProductsByOrder(orderNumber) {
    return await this.orderModel.listProductsByOrder(orderNumber);
  }
}

export default OrderRepository;
