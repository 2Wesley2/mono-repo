import { Router } from 'express';

class PaymentController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAllPayments.bind(this));
    this.router.post('/', this.createPayment.bind(this));
    this.router.get('/:id', this.getPaymentById.bind(this));
    this.router.put('/:id', this.updatePayment.bind(this));
    this.router.delete('/:id', this.deletePayment.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async getAllPayments(req, res, next) {
    try {
      const payments = await this.service.getAllPayments(req.query);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  async createPayment(req, res, next) {
    try {
      const payment = await this.service.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req, res, next) {
    try {
      const payment = await this.service.getPaymentById(req.params.id);
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  async updatePayment(req, res, next) {
    try {
      const updatedPayment = await this.service.updatePayment(req.params.id, req.body);
      res.json(updatedPayment);
    } catch (error) {
      next(error);
    }
  }

  async deletePayment(req, res, next) {
    try {
      await this.service.deletePayment(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentController;
