// Card.js
import { authenticatedRequest } from '../config/authenticatedRequest.js';
import { handleError } from '../errors/Exceptions.js';

export default class Card {
  static async asToken(params = {}) {
    try {
      if (!params.cardNumber || !params.customerId) {
        throw new Error('Missing required parameters: cardNumber or customerId.');
      }

      const response = await authenticatedRequest.post('/v1/tokens/card', params);
      return response?.data?.numberToken ?? null;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async verification(params = {}) {
    try {
      if (!params.numberToken) {
        throw new Error('Missing required parameter: numberToken.');
      }

      const response = await authenticatedRequest.post('/v1/cards/verification', params);
      return response?.data ?? null;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async sendToPOS(transaction) {
    try {
      const { totalAmount, paymentType, posId } = transaction;

      if (!totalAmount || !paymentType || !posId) {
        throw new Error('Missing required transaction parameters: totalAmount, paymentType, or posId.');
      }

      const endpoint = paymentType === 'PIX' ? '/v1/pos/transaction/pix' : '/v1/pos/transaction/card';

      const response = await authenticatedRequest.post(endpoint, {
        posId,
        amount: totalAmount,
        paymentType,
      });
      return response?.data ?? null;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async getTransactionStatus(transactionId) {
    try {
      if (!transactionId) {
        throw new Error('Transaction ID is required to get transaction status.');
      }

      const response = await authenticatedRequest.get(`/v1/pos/transaction/status/${transactionId}`);
      return response?.data ?? null;
    } catch (error) {
      throw handleError(error);
    }
  }
}
