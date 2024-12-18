export default class ClientConfig {
  #sellerId = null;
  #clientId = null;
  #secret = null;
  #env = 'production';

  get sellerId() {
    return this.#sellerId;
  }

  set sellerId(value) {
    this.#sellerId = value;
  }

  get clientId() {
    return this.#clientId;
  }

  set clientId(value) {
    this.#clientId = value;
  }

  get secret() {
    return this.#secret;
  }

  set secret(value) {
    this.#secret = value;
  }

  get env() {
    return this.#env;
  }

  set env(value) {
    this.#env = value;
  }

  get basicAuthToken() {
    if (!this.#clientId || !this.#secret) {
      throw new Error('Client ID and Secret must be set before generating the auth token.');
    }

    const clientSecret = `${this.#clientId}:${this.#secret}`;
    return Buffer.from(clientSecret).toString('base64');
  }
}
