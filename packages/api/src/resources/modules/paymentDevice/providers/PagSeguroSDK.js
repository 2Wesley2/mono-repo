// src/paymentDevice/providers/PagSeguroSDK.js
import PaymentDeviceSDK from '../PaymentDeviceSDK';
import devpagbank from '@api/devpagbank';

class PagSeguroSDK extends PaymentDeviceSDK {
  constructor(config) {
    super();
    this.token = config.token;
    this.baseHeaders = {
      accept: '*/*',
      Authorization: `Bearer ${this.token}`,
    };
  }

  /**
   * Cria um pedido no PagSeguro.
   * @param {Object} params - Parâmetros do pedido.
   * @returns {Object} - Dados do pedido criado.
   */
  async createOrder({ reference_id, customer, items, charges, shipping, notification_urls }) {
    try {
      const response = await devpagbank.criarPedido({
        ...this.baseHeaders,
        reference_id,
        customer,
        items,
        charges,
        shipping,
        notification_urls,
      });
      return response.data;
    } catch (error) {
      throw new Error(`PagSeguro Create Order Error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Realiza o pagamento de um pedido.
   * @param {String} order_id - Identificador do pedido.
   * @param {Object} charges - Informações da cobrança.
   * @returns {Object} - Dados do pagamento realizado.
   */
  async payOrder(order_id, charges) {
    try {
      const response = await devpagbank.pagarPedido({
        ...this.baseHeaders,
        order_id,
        charges,
      });
      return response.data;
    } catch (error) {
      throw new Error(`PagSeguro Pay Order Error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Captura uma transação pré-autorizada.
   * @param {String} charge_id - Identificador da cobrança.
   * @param {Object} amount - Detalhes do valor a ser capturado.
   * @returns {Object} - Dados da captura realizada.
   */
  async capturePayment(charge_id, amount) {
    try {
      const response = await devpagbank.capturarPagamento({
        ...this.baseHeaders,
        charge_id,
        amount,
      });
      return response.data;
    } catch (error) {
      throw new Error(`PagSeguro Capture Payment Error: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default PagSeguroSDK;
