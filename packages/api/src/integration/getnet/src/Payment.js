import { authenticatedRequest } from '../config/authenticatedRequest.js';
import { handleError } from '../errors/Exceptions.js';

export default class Payment {
  static async onCredit(params) {
    try {
      if (!params.amount || !params.cardNumber || !params.expirationDate) {
        throw new Error('Missing required payment parameters: amount, cardNumber, or expirationDate.');
      }

      const { data } = await authenticatedRequest.post('/v1/payments/credit', params);
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async onPix(params) {
    try {
      if (!params.amount || !params.posId) {
        throw new Error('Missing required PIX payment parameters: amount or posId.');
      }

      const { data } = await authenticatedRequest.post('/v1/payments/pix', params);
      return {
        qrCode: data.qrCode,
        transactionId: data.transactionId,
        expiration: data.expiration,
      };
    } catch (error) {
      throw handleError(error);
    }
  }

  static async cancelCredit(paymentId) {
    try {
      if (!paymentId) {
        throw new Error('Payment ID is required to cancel the transaction.');
      }

      const { data } = await authenticatedRequest.post(`/v1/payments/credit/${paymentId}/cancel`);
      return data.status.toLowerCase() === 'canceled';
    } catch (error) {
      throw handleError(error);
    }
  }

  static async monitorTransactionStatus(transactionId, interval = 2000, timeout = 60000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        const { data: status } = await authenticatedRequest.get(`/v1/transactions/status/${transactionId}`);

        if (status?.status?.toLowerCase() === 'approved') {
          return { status: 'approved', data: status };
        }

        if (status?.status?.toLowerCase() === 'declined') {
          return { status: 'declined', data: status };
        }
      } catch (error) {
        console.warn('Error checking transaction status:', error.message);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error('Transaction status monitoring timed out.');
  }
}
