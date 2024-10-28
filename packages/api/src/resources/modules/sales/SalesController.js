import Controller from '../../core/Controller.js';

class SalesController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.createSale.bind(this));
    this.router.get('/:id', this.getSaleById.bind(this));
    this.router.put('/:id', this.updateSale.bind(this));
    this.router.delete('/:id', this.deleteSale.bind(this));
  }

  async createSale(req, res, next) {
    try {
      const sale = await this.service.create(req.body);
      res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  }

  async getSaleById(req, res, next) {
    try {
      const sale = await this.service.getSaleById(req.params.id);
      res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async updateSale(req, res, next) {
    try {
      const updatedSale = await this.service.updateSale(req.params.id, req.body);
      res.json(updatedSale);
    } catch (error) {
      next(error);
    }
  }

  async deleteSale(req, res, next) {
    try {
      await this.service.deleteSale(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default SalesController;
