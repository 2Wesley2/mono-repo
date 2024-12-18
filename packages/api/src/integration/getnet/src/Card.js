import { authRequest } from '../config/Auth.js';

import { handleError } from '../errors/Exceptions';

export default class Card {
  static async asToken(params = {}) {
    try {
      const { data } = await authRequest.post('/v1/tokens/card', params);
      return data.numberToken;
    } catch (ex) {
      throw handleError(ex);
    }
  }

  static async verification(params = {}) {
    try {
      const { data } = await authRequest.post('/v1/cards/verification', params);
      return data;
    } catch (ex) {
      throw handleError(ex);
    }
  }

  static async sendToPOS(transaction) {
    try {
      const { totalAmount, paymentType, posId } = transaction;

      if (!totalAmount || !paymentType || !posId) {
        throw new Error('Missing required transaction parameters: totalAmount, paymentType, or posId');
      }

      const endpoint = paymentType === 'PIX' ? '/v1/pos/transaction/pix' : '/v1/pos/transaction/card';

      const { data } = await authRequest.post(endpoint, {
        posId,
        amount: totalAmount,
        paymentType,
      });
      return data;
    } catch (ex) {
      throw handleError(ex);
    }
  }

  static async getTransactionStatus(transactionId) {
    try {
      if (!transactionId) {
        throw new Error('Transaction ID is required to get transaction status.');
      }
      const { data } = await authRequest.get(`/v1/pos/transaction/status/${transactionId}`);
      return data;
    } catch (ex) {
      throw handleError(ex);
    }
  }
}
