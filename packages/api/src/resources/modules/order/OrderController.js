import debug from '../../../debug/index.js';
import Controller from '../../../resources/core/Controller.js';
import { validateRequest, mergeDuplicateProducts } from '../../../utils/order/index.js';

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
      const productsList = await this.service.listProductsByOrder(orderNumber);
      const products = Array.isArray(productsList) ? productsList : productsList?.products || [];
      const mappedProducts = products.map((item) => {
        if (!item.product || !item.product._id || !item.product.name || item.product.price == null) {
          return null;
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

  async updateOrderProducts(req, res, next) {
    console.log('controller');
    const { orderNumber } = req.params;
    const { products } = req.body;
    try {
      validateRequest('orderNumber', orderNumber);
      validateRequest('updateFields', products);
      const mergedDuplicateProducts = mergeDuplicateProducts(products);
      const updatedProducts = await this.service.updateOrderProducts(orderNumber, mergedDuplicateProducts);
      res.status(200).json({ updatedProducts });
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
