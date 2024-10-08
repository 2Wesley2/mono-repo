import AppError from '../../../errors/AppError.js';

class OrderService {
  constructor(orderRepository) {
    this.repository = orderRepository;
  }

  async createOrder(orderData) {
    const order = await this.repository.create(orderData);
    return order;
  }

  async updateOrder(orderId, updateData) {
    const updatedOrder = await this.repository.update(orderId, updateData);
    if (!updatedOrder) {
      throw new AppError(404, 'Pedido não encontrado para atualização.');
    }
    return updatedOrder;
  }
}

export default OrderService;
