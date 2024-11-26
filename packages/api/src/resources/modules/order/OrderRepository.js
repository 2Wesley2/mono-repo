import debug from '../../../debug/index.js';
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
    return await this.orderModel.createOrder(data);
  }

  async bulkCreate(data) {
    console.log('[DEBUG] Dados recebidos no repositório:', data);
    return await this.orderModel.bulkCreate(data);
  }
  async findByOrderNumber(orderNumber) {
    debug.logger.debug(`Repositório: findByOrderNumber chamado com orderNumber: ${orderNumber}`);
    const result = await this.orderModel.findByOrderNumber(orderNumber);
    debug.logger.debug(`Repositório: Resultado de findByOrderNumber: ${JSON.stringify(result)}`);
    return result;
  }

  async updateByOrderNumber(orderNumber, updateFields) {
    debug.logger.debug(
      `Repositório: updateByOrderNumber chamado com orderNumber: ${orderNumber} e updateFields: ${JSON.stringify(updateFields)}`,
    );
    const result = await this.orderModel.updateByOrderNumber(orderNumber, updateFields);
    debug.logger.debug(`Repositório: Resultado de updateByOrderNumber: ${JSON.stringify(result)}`);
    return result;
  }
  async listProductsByOrderRepository(orderNumber) {
    return await this.orderModel.listProductsByOrder(orderNumber);
  }
}

export default OrderRepository;
