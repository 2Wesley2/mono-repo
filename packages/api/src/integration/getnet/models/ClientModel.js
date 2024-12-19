export default class ClientModel {
  #sellerId = null;
  #clientId = null;
  #secret = null;
  #env = 'production';

  constructor({ sellerId, clientId, secret, env = 'production' }) {
    this.#sellerId = sellerId;
    this.#clientId = clientId;
    this.#secret = secret;
    this.#env = env;
  }

  get sellerId() {
    return this.#sellerId;
  }

  get clientId() {
    return this.#clientId;
  }

  get secret() {
    return this.#secret;
  }

  get env() {
    return this.#env;
  }

  get basicAuthToken() {
    if (!this.#clientId || !this.#secret) {
      throw new Error('Client ID and Secret must be set before generating the auth token.');
    }
    const clientSecret = `${this.#clientId}:${this.#secret}`;
    return Buffer.from(clientSecret).toString('base64');
  }
}
