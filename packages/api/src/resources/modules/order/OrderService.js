import debug from '../../../debug/index.js';
import {
  //handleAddProductToOrder,
  updateOrderProducts,
  //updateProductQuantityOrRemove,
  validateProductInOrder,
  shouldUpdateStock,
  validateOrderAndProductExistence,
  updateOrderStatus,
} from '../../../utils/order/index.js';
import AppError from '../../../errors/AppError.js';
class OrderService {
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }

  async createOrder(orderData) {
    const result = await this.repository.createOrder(orderData);
    return result;
  }

  async bulkCreate(orderList) {
    const createdOrders = await this.repository.bulkCreate(orderList);
    return createdOrders;
  }
  async modifyProduct(orderNumber, data) {
    const order = await this.repository.findByOrderNumberRepository(orderNumber);
    if (!order) {
      throw new AppError(404, `Order with number ${orderNumber} not found.`);
    }
    const updatedOrder =
      data.operation === 'add'
        ? await this.addProduct(order._id, data.products)
        : await this.removeProducts(order._id, data.products);
    return updatedOrder;
  }

  async addProduct(orderId, productDataList) {
    if (!Array.isArray(productDataList) || productDataList.length === 0) {
      throw new AppError(400, 'Lista de produtos deve ser um array não vazio.');
    }

    const [order, products] = await Promise.all([
      this.repository.findByIdInRepository(orderId),
      Promise.all(
        productDataList.map(async (data) => {
          const product = await this.productService.findByIdInService(data.product);
          if (!product) {
            throw new AppError(404, `Produto com ID ${data.product} não encontrado.`);
          }
          return product;
        }),
      ),
    ]);

    productDataList.forEach((productData, index) => {
      const product = products[index];

      validateOrderAndProductExistence({ order, product });

      if (shouldUpdateStock(product) && product.quantity < productData.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Required: ${productData.quantity}.`,
        );
      }

      updateOrderProducts({ order, productData });

      if (shouldUpdateStock(product)) {
        this.productService.updateStock(product._id, productData.quantity);
      }
    });

    updateOrderStatus(order);

    const updatedOrder = await this.repository.updateOrderRepository(orderId, {
      status: order.status,
      products: order.products,
    });

    return updatedOrder;
  }

  async removeProducts(orderId, productsToRemove) {
    const order = await this.repository.findByIdInRepository(orderId);

    if (!order) {
      throw new AppError(404, 'Order does not exist.');
    }

    for (const { product: productId, quantity = 1 } of productsToRemove) {
      const product = await this.productService.findById(productId);
      validateOrderAndProductExistence({ order, product });

      const productIndex = order.products.findIndex((p) => p.product.toString() === productId);
      validateProductInOrder(productIndex);

      const productData = order.products[productIndex];
      if (productData.quantity > quantity) {
        productData.quantity -= quantity;
      } else {
        order.products.splice(productIndex, 1);
      }

      if (shouldUpdateStock(product)) {
        await this.productService.updateStock(productId, -quantity);
      }
    }

    const updatedOrder = await this.repository.updateOrderRepository(orderId, {
      status: order.status,
      products: order.products,
    });

    debug.logger.info('Service: Products removed from order', {
      orderId,
      productsToRemove,
    });

    return updatedOrder;
  }

  async delete(orderNumber) {
    try {
      const order = await this.repository.findByOrderNumberRepository(orderNumber);
      if (!order) {
        throw new AppError(404, 'Order does not exist.');
      }

      if (order.status !== 'Stand By') {
        throw new AppError(400, 'Only orders in "Stand By" status can be deleted.');
      }

      const deleted = await this.repository.deleteByOrderNumber(orderNumber);
      debug.logger.info('OrderService.delete: Order deleted', { orderNumber });
      return deleted;
    } catch (error) {
      debug.logger.error('OrderService.delete: Error deleting order', { orderNumber, error });
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
