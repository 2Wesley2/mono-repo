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
      console.log('[DEBUG] Erro de validação Joi:', error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log('[DEBUG] Body validado com sucesso:', value);
    try {
      const order = await this.service.createOrder(value);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async bulkCreate(req, res, next) {
    const { body } = req;
    console.log('[DEBUG] Body recebido no bulkCreate:', body);

    const validationSchema = Joi.array()
      .items(
        Joi.object({
          orderNumber: Joi.number().required(),
          status: Joi.string().valid('Stand By', 'In Progress').required(),
          totalAmount: Joi.number().min(0).required(),
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
      return res.status(400).json({ success: false, message: error.message });
    }

    try {
      const createdOrders = await this.service.bulkCreate(value);
      res.status(201).json({ success: true, data: createdOrders });
    } catch (error) {
      next(error);
    }
  }
  async listProductsByOrder(req, res, next) {
    try {
      let { orderNumber } = req.params;

      orderNumber = parseInt(orderNumber, 10);
      if (isNaN(orderNumber)) {
        return res.status(400).json({ success: false, message: 'Parâmetro orderNumber deve ser um número válido.' });
      }
      const productsList = await this.service.listProductsByOrder(orderNumber);

      const products = Array.isArray(productsList) ? productsList : productsList?.products || [];

      const mappedProducts = products.map((item) => {
        if (!item.product || !item.product._id || !item.product.name || item.product.price == null) {
          return null; // Ignora itens com estrutura inválida
        }

        return {
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
          },
          quantity: item.quantity,
        };
      });

      const validProducts = mappedProducts.filter(Boolean);

      const result = {
        orderNumber: productsList.orderNumber,
        products: validProducts,
      };

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
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
      debug.logger.superdebug(
        updateFields,
        0,
        'root',
        '[CONTROLLER-updateOrderContent] const { updateFields } = req.body;',
      );
      debug.logger.superdebug(
        orderNumberStr,
        0,
        'root',
        '[CONTROLLER-updateOrderContent] const { orderNumber: orderNumberStr } = req.params;',
      );
      const orderNumber = this._validateOrderNumber(orderNumberStr);
      debug.logger.superdebug(
        orderNumber,
        0,
        'root',
        '[CONTROLLER-updateOrderContent] const orderNumber = this._validateOrderNumber(orderNumberStr);',
      );

      if (!updateFields || !Array.isArray(updateFields) || updateFields.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'Nenhuma alteração realizada. O array de atualizações está vazio.',
        });
      }
      debug.logger.info('passando updateField para validaçãos com this._validateUpdateFields(updateFields); ');
      this._validateUpdateFields(updateFields);

      const result = await this.service.updateOrderContent(orderNumber, updateFields);
      debug.logger.superdebug(
        result,
        0,
        'root',
        '[CONTROLLER-updateOrderContent] const result = await this.service.updateOrderContent(orderNumber, updateFields);',
      );
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

    for (const { product, quantity, ...rest } of updateFields) {
      if (!product || typeof product !== 'string') {
        throw new Error('Each updateFields item must have a valid product string.');
      }
      if (typeof quantity !== 'number' || quantity <= 0) {
        throw new Error('Each updateFields item must have a valid positive quantity.');
      }
      if (Object.keys(rest).length > 0) {
        debug.logger.warn(`Unexpected fields in updateFields item: ${JSON.stringify(rest)}`);
      }
    }
  }
}

export default OrderController;
