import { MercadoPagoConfig, Payment } from 'mercadopago';
import AppError from '../../../errors/AppError.js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const payment = new Payment(client);

class PaymentService {
  constructor(paymentRepository) {
    this.repository = paymentRepository;
  }

  async createPayment({ amount, orderId, payerEmail }) {
    try {
      const paymentData = {
        transaction_amount: amount,
        description: `Pagamento para pedido ${orderId}`,
        payment_method_id: 'credit_card',
        payer: {
          email: payerEmail,
        },
      };

      const response = await payment.create({ body: paymentData });

      const paymentDoc = await this.repository.create({
        id: response.body.id,
        amount,
        status: response.body.status,
        order: orderId,
      });

      return {
        id: paymentDoc.id,
        status: response.body.status,
        paymentUrl: response.body.init_point,
      };
    } catch (error) {
      throw new AppError(500, `Erro ao criar pagamento: ${error.message}`);
    }
  }
}

export default PaymentService;
