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
    this.router.get('/:orderNumber/products', this.listProductsByOrderController.bind(this));
    this.router.put('/:orderNumber/product', this.updateOrderContent.bind(this));
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
        .default([]),
    });

    const { error, value } = validationSchema.validate(body);
    if (error) {
      debug.logger.error('OrderController.createOrder: Validation error', { error: error.message });
      return res.status(400).json({ success: false, message: error.message });
    }

    try {
      const order = await this.service.createOrder(value);
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
    const { body } = req;

    const validationSchema = Joi.array()
      .items(
        Joi.object({
          orderNumber: Joi.number().required(),
          status: Joi.string().valid('Stand By', 'In Progress').required(),
          products: Joi.array()
            .items(
              Joi.object({
                product: Joi.string().required(),
                quantity: Joi.number().greater(0).required(),
              }),
            )
            .default([]),
        }),
      )
      .min(1);

    const { error, value } = validationSchema.validate(body);
    if (error) {
      debug.logger.error('OrderController.bulkCreate: Validation error', { error: error.message });
      return res.status(400).json({ success: false, message: error.message });
    }

    try {
      const createdOrders = await this.service.bulkCreate(value);
      debug.logger.info('OrderController.bulkCreate: Bulk orders created successfully', { data: createdOrders });
      res.status(201).json({ success: true, data: createdOrders });
    } catch (error) {
      debug.logger.error('OrderController.bulkCreate: Error creating bulk orders', { error });
      next(error);
    }
  }

  /**
   * Atualiza as quantidades de produtos em uma ordem.
   * @param {number} orderNumber - Número da ordem.
   * @param {Object[]} updateProducts - Lista de produtos a serem atualizados no formato { product, quantity }.
   * @throws {Error} Lança erro se a ordem ou algum produto não for encontrado.
   */

  async updateOrderContent(req, res, next) {
    try {
      const { orderNumber: orderNumberStr } = req.params;
      const { updateFields } = req.body;

      const orderNumber = this._validateOrderNumber(orderNumberStr);
      this._validateUpdateFields(updateFields);

      const result = await this.service.updateOrderContent(orderNumber, updateFields);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }

  async listProductsByOrderController(req, res, next) {
    try {
      const { orderNumber } = req.params;
      const productsList = await this.service.listProductsByOrderService(orderNumber);
      debug.logger.info(
        `OrderController.listProductsByOrderController: get products by orderNumber: ${orderNumber} successfully`,
      );

      const result = {
        orderNumber: productsList.orderNumber,
        products: productsList.products.map((item) => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
          },
          quantity: item.quantity,
        })),
      };

      console.log(JSON.stringify(result, null, 2));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  _validateOrderNumber(orderNumberStr) {
    const orderNumber = parseInt(orderNumberStr, 10);
    if (isNaN(orderNumber)) {
      throw new Error('Invalid orderNumber. Must be a number.');
    }
    return orderNumber;
  }

  _validateUpdateFields(updateFields) {
    if (!Array.isArray(updateFields) || updateFields.length === 0) {
      throw new Error('updateFields array is required and cannot be empty');
    }

    for (const field of updateFields) {
      if (!field.product || typeof field.product !== 'string') {
        throw new Error('Each updateFields item must have a valid product string.');
      }
      if (!field.quantity || typeof field.quantity !== 'number' || field.quantity <= 0) {
        throw new Error('Each updateFields item must have a valid positive quantity.');
      }
    }
  }
}

export default OrderController;
