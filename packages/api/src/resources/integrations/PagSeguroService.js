import config from '../../config/index.js';

class PagSeguroService {
  constructor() {
    this.baseUrl = config.PagSeguroBaseUrl;
    this.authHeader = `Bearer ${config.PagSeguroAccessToken}`;
  }

  /**
   * Realiza uma requisição para a API do PagSeguro usando fetch.
   * @param {String} endpoint - Endpoint da API.
   * @param {Object} options - Opções da requisição (método, body, headers, etc.).
   * @returns {Promise<Object>} - Resposta da API.
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.authHeader,
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API do PagSeguro: ${errorData.error_messages || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Erro ao fazer a requisição para ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Cria um pagamento via Pix.
   * @param {Object} sale - Detalhes da venda.
   * @returns {Promise<Object>} - Dados do QR Code Pix.
   */

  async createPixPayment(sale) {
    return this.request('/charges', {
      method: 'POST',
      body: JSON.stringify({
        reference_id: sale.id,
        description: sale.description,
        amount: {
          value: Math.round(sale.totalAmount * 100),
          currency: 'BRL',
        },
        payment_method: {
          type: 'PIX',
        },
      }),
    });
  }

  /**
   * Cria um pagamento com cartão de crédito/débito.
   * @param {Object} sale - Detalhes da venda.
   * @param {Object} cardDetails - Detalhes do cartão.
   * @returns {Promise<Object>} - Resposta do pagamento.
   */
  async createCardPayment(sale, cardDetails) {
    return this.request('/charges', {
      method: 'POST',
      body: JSON.stringify({
        reference_id: sale.id,
        description: sale.description,
        amount: {
          value: Math.round(sale.totalAmount * 100),
          currency: 'BRL',
        },
        payment_method: {
          type: 'CREDIT_CARD',
          installments: cardDetails.installments || 1,
          capture: true,
          card: {
            number: cardDetails.number,
            exp_month: cardDetails.expMonth,
            exp_year: cardDetails.expYear,
            security_code: cardDetails.securityCode,
            holder: {
              name: cardDetails.holderName,
            },
          },
        },
      }),
    });
  }

  /**
   * Cria um pagamento com vale-refeição ou vale-alimentação.
   * @param {Object} sale - Detalhes da venda.
   * @returns {Promise<Object>} - Resposta do pagamento.
   */
  async createVoucherPayment(sale) {
    return this.request('/charges', {
      method: 'POST',
      body: JSON.stringify({
        reference_id: sale.id,
        description: sale.description,
        amount: {
          value: Math.round(sale.totalAmount * 100),
          currency: 'BRL',
        },
        payment_method: {
          type: 'VOUCHER',
        },
      }),
    });
  }
}

export default new PagSeguroService();
