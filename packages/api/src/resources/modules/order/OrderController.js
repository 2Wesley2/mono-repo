import Joi from 'joi';
import debug from '../../../debug/index.js';
import Controller from '../../../resources/core/Controller.js';

class OrderController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/', this.createOrder.bind(this));
    this.router.post('/bulk', this.bulkCreate.bind(this));
    this.router.put('/:orderNumber/product', this.modifyProduct.bind(this));
    this.router.get('/', this.listOrders.bind(this));
    this.router.delete('/:orderNumber', this.delete.bind(this));
  }

  async createOrder(req, res, next) {
    const { body } = req;
    debug.logger.debug('OrderController.createOrder: Received request', { body });

    const validationSchema = Joi.object({
      orderNumber: Joi.number().required(),
      status: Joi.string().valid('Stand By', 'In Progress').required(),
      products: Joi.array()
        .items(
          Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().greater(0).required(),
          }),
        )
        .optional(),
    });

    const { error } = validationSchema.validate(body);
    if (error) {
      debug.logger.error('OrderController.createOrder: Validation error', { error: error.message });
      return res.status(400).json({ success: false, message: error.message });
    }

    try {
      const order = await this.service.createOrder(body);
      debug.logger.info('OrderController.createOrder: Order created successfully', { data: order });
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      debug.logger.error('OrderController.createOrder: Error creating order', {
        body,
        error: error.message,
        stack: error.stack,
      });
      next(error);
    }
  }

  async bulkCreate(req, res, next) {
    try {
      const orders = req.body;
      const createdOrders = await this.service.bulkCreate(orders);
      debug.logger.info('Controller: Bulk orders created successfully', { data: createdOrders });
      res.status(201).json({ success: true, data: createdOrders });
    } catch (error) {
      debug.logger.error('Controller: Error creating bulk orders', { error });
      next(error);
    }
  }
  async modifyProduct(req, res, next) {
    const { orderNumber } = req.params;
    const { body } = req;

    debug.logger.debug('OrderController.modifyProduct: Corpo recebido no backend', body);

    const validationSchema = Joi.object({
      operation: Joi.string().valid('add', 'remove').required(),
      products: Joi.array()
        .items(
          Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().greater(0).when('operation', { is: 'add', then: Joi.required() }),
          }),
        )
        .required(),
    });

    const { error, value } = validationSchema.validate(body);
    if (error) {
      debug.logger.error('OrderController.modifyProduct: Validation error', { error: error.message });
      return res.status(400).json({ success: false, message: error.message });
    }

    try {
      const updatedOrder = await this.service.modifyProduct(orderNumber, value);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      debug.logger.error('OrderController.modifyProduct: Error modifying product in order', {
        orderNumber,
        body,
        error,
      });
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
    const { orderNumber } = req.params;
    try {
      await this.service.delete(orderNumber);
      debug.logger.info('OrderController.delete: Order deleted', { orderNumber });
      res.status(204).end();
    } catch (error) {
      debug.logger.error('OrderController.delete: Error deleting order', { error });
      next(error);
    }
  }
}

export default OrderController;
