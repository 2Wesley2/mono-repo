// src/resources/modules/orders/OrderController.js
import { Router } from 'express';
import OrderService from './OrderService.js';
import PaymentService from '../payments/PaymentService.js';

class OrderController {
  constructor(orderService, paymentService) {
    this.orderService = orderService;
    this.paymentService = paymentService;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.createOrderWithPayment.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async createOrderWithPayment(req, res, next) {
    try {
      const orderData = req.body;

      // Cria o pedido no banco de dados
      const order = await this.orderService.createOrder(orderData);

      // Inicia o pagamento com o Mercado Pago
      const payment = await this.paymentService.createPayment({
        amount: order.totalAmount,
        orderId: order.id,
      });

      // Atualiza o pedido com o id do pagamento
      await this.orderService.updateOrder(order.id, { payment: payment.id });

      res.status(201).json({ order, paymentUrl: payment.paymentUrl });
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
