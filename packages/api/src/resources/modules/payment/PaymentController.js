import Controller from '../../core/Controller.jss';
import AppError from '../../../errors/AppError.js';

class PaymentController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/payments', this.createPayment.bind(this));
    this.router.post('/payments/:id/process', this.processPayment.bind(this));
    this.router.post('/payments/:id/cancel', this.cancelTransaction.bind(this));
  }

  async createPayment(req, res, next) {
    try {
      const result = await this.service.createPayment(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req, res, next) {
    try {
      const result = await this.service.processPayment(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelTransaction(req, res, next) {
    try {
      const result = await this.service.cancelTransaction(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
export default PaymentController;
