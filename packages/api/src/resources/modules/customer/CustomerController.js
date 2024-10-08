import { Router } from 'express';

class CustomerController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/:id/cashback', this.addCashback.bind(this));
    this.router.post('/:id/use-cashback', this.useCashback.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async addCashback(req, res, next) {
    try {
      const { amount } = req.body;
      const customer = await this.service.addCashbackToCustomer(req.params.id, amount);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async useCashback(req, res, next) {
    try {
      const { amount } = req.body;
      const customer = await this.service.useCashbackFromCustomer(req.params.id, amount);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
}

export default CustomerController;
