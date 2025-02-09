import Controller from '../../../../core/infrastructure/components/base/Controller.js';

export default class BillController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.get('/:orderNumber/products', this.listProductsByOrder.bind(this));
    this.router.put('/:orderNumber/order', this.updateOrderProducts.bind(this));
    this.router.post('/', this.createBill.bind(this));
  }

  async createBill(req, res, next) {
    try {
      const bill = await this.service.createBill(req.body);
      return res.status(201).json(bill);
    } catch (error) {
      next(error);
    }
  }

  async listProductsByOrder(req, res, next) {
    try {
      let { orderNumber } = req.params;
      orderNumber = parseInt(orderNumber, 10);
      if (isNaN(orderNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro orderNumber deve ser um número válido.'
        });
      }
      const products = await isPromiseResolved(this.service.listProductsByOrder(orderNumber));
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderProducts(req, res, next) {
    const { orderNumber } = req.params;
    const { products } = req.body;
    try {
      res.status(200).json({ updatedProducts });
    } catch (error) {
      next(error);
    }
  }
}
