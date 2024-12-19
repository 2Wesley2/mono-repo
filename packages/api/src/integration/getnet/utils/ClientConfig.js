export default class ClientConfig {
  static instance = null;

  constructor(clientModel) {
    if (ClientConfig.instance) {
      return ClientConfig.instance;
    }

    if (!clientModel) {
      throw new Error('ClientModel instance is required to initialize ClientConfig.');
    }

    this.clientModel = clientModel;
    ClientConfig.instance = this;
  }

  static getInstance() {
    if (!ClientConfig.instance) {
      throw new Error('ClientConfig has not been initialized. Call the constructor first.');
    }
    return ClientConfig.instance;
  }

  get client() {
    return this.clientModel;
  }
}
