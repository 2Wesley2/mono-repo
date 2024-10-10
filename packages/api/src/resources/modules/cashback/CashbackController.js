import { Router } from 'express';

class CashbackController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/customer/:customerId', this.getCashbacksByCustomer.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async getCashbacksByCustomer(req, res, next) {
    try {
      const cashbacks = await this.service.getVouchersByCustomerId(req.params.customerId);
      res.json(cashbacks);
    } catch (error) {
      next(error);
    }
  }
}

export default CashbackController;
