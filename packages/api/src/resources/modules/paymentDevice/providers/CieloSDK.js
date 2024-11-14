import PaymentDeviceSDK from '../PaymentDeviceSDK';
import Cielo from 'cielo-sdk';

class CieloSDK extends PaymentDeviceSDK {
  constructor(config) {
    super();
    this.sdk = new Cielo({
      merchantId: config.merchantId,
      merchantKey: config.apiKey,
      sandbox: config.sandbox || false,
    });
  }

  async initiatePayment({ amount, type }) {
    try {
      const paymentType = { credit: 'CREDIT_CARD', debit: 'DEBIT_CARD' }[type];
      if (!paymentType) throw new Error('Invalid payment type for Cielo');

      const response = await this.sdk.payment.createTransaction({
        amount: Math.round(amount * 100),
        type: paymentType,
        card: {
          number: '4111111111111111',
          expirationDate: '12/2030',
          holder: 'Test User',
          cvv: '123',
        },
      });

      if (response.payment.status === 1) return { status: 'approved' };
      return { status: 'declined', message: response.payment.returnMessage };
    } catch (error) {
      throw new Error(`Cielo Error: ${error.message}`);
    }
  }

  async cancelTransaction(paymentId) {
    try {
      const response = await this.sdk.payment.cancelTransaction(paymentId);
      return response;
    } catch (error) {
      throw new Error(`Cielo Cancel Error: ${error.message}`);
    }
  }
}

export default CieloSDK;
