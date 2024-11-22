import debug from '../../../debug/index.js';

class OrderRepository {
  constructor(model) {
    this.model = model;
  }

  async createOrder(data) {
    const result = await this.model.createOrder(data);
    return result;
  }

  async bulkCreate(data) {
    const result = await this.model.bulkCreate(data);
    return result;
  }

  async findByIdInRepository(id) {
    const order = await this.model.findByIdInModel(id);
    return order;
  }

  async find(filter = {}) {
    const orders = await this.model.find(filter);
    debug.logger.info('Repository: Orders found', { filter });
    return orders;
  }
  async findByOrderNumberRepository(orderNumber) {
    const order = await this.model.findByOrderNumberModel({ orderNumber });
    return order;
  }
  async updateOrderRepository(id, data) {
    const updatedOrder = await this.model.updateOrderModel(id, data);
    return updatedOrder;
  }

  async delete(id) {
    const deleted = await this.model.delete(id);
    return deleted;
  }
}

export default OrderRepository;
