import Controller from '../../../resources/core/Controller.js';
import { validateRequest, mergeDuplicateProducts } from '../../../utils/order/index.js';
import debug from '../../../debug/index.js';

class OrderController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    //  this.router.post('/', this.createOrder.bind(this));
    // this.router.post('/bulk', this.bulkCreate.bind(this));
    this.router.get('/:orderNumber/products', this.listProductsByOrder.bind(this));
    this.router.put('/:orderNumber/order', this.updateOrderProducts.bind(this));
  }
  async listProductsByOrder(req, res, next) {
    try {
      let { orderNumber } = req.params;
      orderNumber = parseInt(orderNumber, 10);
      if (isNaN(orderNumber)) {
        return res.status(400).json({ success: false, message: 'Parâmetro orderNumber deve ser um número válido.' });
      }
      const products = await this.service.listProductsByOrder(orderNumber);
      console.log(JSON.stringify(products));
      return res.status(200).json(products);
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

  async updateOrderProducts(req, res, next) {
    const { orderNumber } = req.params;
    const { products } = req.body;
    try {
      validateRequest('orderNumber', orderNumber);
      validateRequest('products', products);
      const mergedDuplicateProducts = mergeDuplicateProducts(products);
      const updatedProducts = await this.service.updateOrderProducts(orderNumber, mergedDuplicateProducts);
      res.status(200).json({ updatedProducts });
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
