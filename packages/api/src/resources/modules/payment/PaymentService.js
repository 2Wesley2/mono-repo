import AppError from '../../../errors/AppError.js';

class PaymentService {
  constructor(repository, paymentDeviceApi) {
    this.repository = repository;
    this.paymentDeviceApi = paymentDeviceApi;
  }

  async createPayment(data) {
    const { type, amount } = data;

    if (!['cash', 'credit', 'debit', 'meal-voucher'].includes(type)) {
      throw new AppError(400, 'Invalid payment type');
    }

    if (!amount || amount <= 0) {
      throw new AppError(400, 'Amount must be greater than zero');
    }

    return this.repository.create({ ...data, status: 'pending' });
  }

  async processPayment(paymentId) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }

    if (payment.status !== 'pending') {
      throw new AppError(400, 'Only pending payments can be processed');
    }

    try {
      const deviceResponse = await this.paymentDeviceApi.sendPayment({
        amount: payment.amount,
        type: payment.type,
      });

      if (deviceResponse.status === 'approved') {
        payment.status = 'completed';
      } else {
        throw new AppError(400, 'Payment declined');
      }

      return await this.repository.update(paymentId, payment);
    } catch (error) {
      throw new AppError(500, `Payment processing failed: ${error.message}`);
    }
  }

  async cancelTransaction(paymentId) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }

    if (payment.status !== 'pending') {
      throw new AppError(400, 'Only pending payments can be cancelled');
    }

    try {
      await this.paymentDeviceApi.cancelTransaction();
      payment.status = 'cancelled';
      return await this.repository.update(paymentId, payment);
    } catch (error) {
      throw new AppError(500, `Failed to cancel transaction: ${error.message}`);
    }
  }
}
export default PaymentService;
