import { Router } from 'express';

class CashbackController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/customer/:customerId', this.getCashbacksByCustomer.bind(this));
    this.router.patch('/:id/mark-used', this.markCashbackAsUsed.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async getCashbacksByCustomer(req, res, next) {
    try {
      const cashbacks = await this.service.findCashbacksByCustomer(req.params.customerId);
      res.json(cashbacks);
    } catch (error) {
      next(error);
    }
  }

  async markCashbackAsUsed(req, res, next) {
    try {
      const cashback = await this.service.markCashbackAsUsed(req.params.id);
      res.json(cashback);
    } catch (error) {
      next(error);
    }
  }
}

export default CashbackController;
