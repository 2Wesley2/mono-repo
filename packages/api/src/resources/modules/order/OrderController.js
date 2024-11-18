import debug from '../../../debug/index.js';
import Controller from '../../../resources/core/Controller.js';

class OrderController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/', this.create.bind(this));
    this.router.put('/:id/product', this.addProduct.bind(this));
    this.router.delete('/:id/product/:productId', this.removeProduct.bind(this));
    this.router.get('/', this.listOrders.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  async create(req, res, next) {
    try {
      const order = await this.service.create(req.body);
      debug.logger.info('Controller: Order created successfully', { data: order });
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      debug.logger.error('Controller: Error creating order', { error });
      next(error);
    }
  }

  async addProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const updatedOrder = await this.service.addProduct(id, productData);
      debug.logger.info('Controller: Product added to order', { orderId: id });
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      debug.logger.error('Controller: Error adding product to order', { error });
      next(error);
    }
  }

  async removeProduct(req, res, next) {
    try {
      const { id, productId } = req.params;
      const updatedOrder = await this.service.removeProduct(id, productId);

      debug.logger.info('Controller: Product removed from order', { orderId: id, productId });
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      debug.logger.error('Controller: Error removing product from order', { error });
      next(error);
    }
  }

  async listOrders(req, res, next) {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};
      const orders = await this.service.find(filter);
      debug.logger.info('Controller: Orders listed', { filter });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      debug.logger.error('Controller: Error listing orders', { error });
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      debug.logger.info('Controller: Order deleted', { orderId: id });
      res.status(204).end();
    } catch (error) {
      debug.logger.error('Controller: Error deleting order', { error });
      next(error);
    }
  }
}

export default OrderController;
