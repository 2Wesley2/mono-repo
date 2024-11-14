import CieloSDK from './providers/CieloSDK';
import PagSeguroSDK from './providers/PagSeguroSDK';

class PaymentDeviceManager {
  constructor() {
    this.providers = {
      cielo: CieloSDK,
      pagseguro: PagSeguroSDK,
    };
  }

  /**
   * Retorna o SDK da maquininha selecionada.
   * @param {string} provider - Nome do provedor (ex.: 'cielo', 'pagseguro').
   * @param {Object} config - Configurações específicas para o SDK.
   * @returns {PaymentDeviceSDK}
   */
  getProvider(provider, config) {
    const ProviderClass = this.providers[provider];
    if (!ProviderClass) throw new Error(`Unsupported provider: ${provider}`);
    return new ProviderClass(config);
  }
}

export default PaymentDeviceManager;
