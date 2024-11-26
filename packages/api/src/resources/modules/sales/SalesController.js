import Controller from '../../core/Controller.js';

class SalesController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.createSale.bind(this));
  }

  async createSale(req, res, next) {
    try {
      const sale = await this.service.create(req.body);
      res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  }
}

export default SalesController;
