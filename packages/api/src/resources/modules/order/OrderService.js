import debug from '../../../debug/index.js';
import {
  handleAddProductToOrder,
  updateOrderProducts,
  updateProductQuantityOrRemove,
  validateProductInOrder,
  shouldUpdateStock,
  validateOrderAndProductExistence,
  updateOrderStatus,
} from '../../../utils/order/index.js';

class OrderService {
  constructor({ repository, productService }) {
    this.repository = repository;
    this.productService = productService;
  }

  async create(orderData) {
    try {
      const result = await this.repository.create(orderData);
      debug.logger.info('Service: Order created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Service: Error creating order', { error });
      throw error;
    }
  }

  async addProduct(orderId, productData) {
    try {
      const [order, product] = await Promise.all([
        this.repository.findById(orderId),
        this.productService.findById(productData.product),
      ]);

      validateOrderAndProductExistence({ order, product });
      handleAddProductToOrder({ product, productData });
      updateOrderProducts({ order, productData });
      updateOrderStatus(order);

      if (shouldUpdateStock(product)) {
        await this.productService.updateStock(product._id, productData.quantity);
      }

      const updatedOrder = await this.repository.update(orderId, {
        status: order.status,
        products: order.products,
      });

      return updatedOrder;
    } catch (error) {
      debug.logger.error('Service: Error adding product to order', { orderId, productData, error });
      throw error;
    }
  }

  async removeProduct(orderId, productId) {
    try {
      const [order, product] = await Promise.all([
        this.repository.findById(orderId),
        this.productService.findById(productId),
      ]);

      validateOrderAndProductExistence({ order, product });

      // Encontra o índice do produto na lista do pedido
      const productIndex = order.products.findIndex((p) => p.product.toString() === productId);

      // Valida se o produto está no pedido
      validateProductInOrder(productIndex);

      // Atualiza a quantidade ou remove o produto
      updateProductQuantityOrRemove(order, productIndex);

      // Atualiza o estoque, se necessário
      if (shouldUpdateStock(product)) {
        await this.productService.updateStock(productId, -1);
      }

      // Salva as alterações no banco
      const updatedOrder = await this.repository.update(orderId, {
        status: order.status,
        products: order.products,
      });

      debug.logger.info('Service: Product quantity updated or removed from order', {
        orderId,
        productId,
      });

      return updatedOrder;
    } catch (error) {
      debug.logger.error('Service: Error removing product from order', {
        orderId,
        productId,
        error,
      });
      throw error;
    }
  }

  async delete(orderId) {
    try {
      const order = await this.repository.findById(orderId);
      if (!order) {
        throw new Error('Order does not exist.');
      }

      if (order.status !== 'Stand By') {
        throw new Error('Only orders in Stand By status can be deleted.');
      }

      const deleted = await this.repository.delete(orderId);
      debug.logger.info('Service: Order deleted', { orderId });
      return deleted;
    } catch (error) {
      debug.logger.error('Service: Error deleting order', { orderId, error });
      throw error;
    }
  }

  async find(filter = {}) {
    try {
      const orders = await this.repository.find(filter);
      debug.logger.info('Service: Orders found', { filter });
      return orders;
    } catch (error) {
      debug.logger.error('Service: Error finding orders', { filter, error });
      throw error;
    }
  }
}

export default OrderService;
