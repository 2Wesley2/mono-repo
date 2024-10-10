import { Router } from 'express';

class CustomerController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/:id/voucher', this.addVoucherToCustomer.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async addVoucherToCustomer(req, res, next) {
    try {
      const { voucherId } = req.body;
      const customer = await this.service.addVoucherToCustomer(req.params.id, voucherId);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
}

export default CustomerController;
