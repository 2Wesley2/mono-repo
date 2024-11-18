import debug from '../../../debug/index.js';

class OrderRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      debug.logger.info('Repository: Order created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Repository: Error creating order', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      const order = await this.model.findById(id);
      debug.logger.info('Repository: Order found', { id });
      return order;
    } catch (error) {
      debug.logger.error('Repository: Error finding order by ID', { id, error });
      throw error;
    }
  }

  async find(filter = {}) {
    try {
      const orders = await this.model.find(filter);
      debug.logger.info('Repository: Orders found', { filter });
      return orders;
    } catch (error) {
      debug.logger.error('Repository: Error finding orders', { filter, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updatedOrder = await this.model.update(id, data);
      debug.logger.info('Repository: Order updated', { id, data: updatedOrder });
      return updatedOrder;
    } catch (error) {
      debug.logger.error('Repository: Error updating order', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await this.model.delete(id);
      debug.logger.info('Repository: Order deleted', { id });
      return deleted;
    } catch (error) {
      debug.logger.error('Repository: Error deleting order', { id, error });
      throw error;
    }
  }
}

export default OrderRepository;
