export default class AuthenticatedRequest {
  constructor(httpClient, tokenProvider, clientConfig) {
    if (!httpClient || !tokenProvider || !clientConfig) {
      throw new Error('HttpClient, AccessTokenProvider, and ClientConfig are required for AuthenticatedRequest.');
    }

    this.httpClient = httpClient;
    this.tokenProvider = tokenProvider;
    this.clientConfig = clientConfig.client;
  }

  async request(endpoint, method, body = null, customHeaders = {}) {
    if (!this.tokenProvider) {
      throw new Error('AccessTokenProvider is not initialized.');
    }

    const accessToken = await this.tokenProvider.getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Seller-Id': this.clientConfig.sellerId,
      ...customHeaders,
    };

    return this.httpClient.request(endpoint, method, body, headers);
  }

  async get(endpoint, headers = {}) {
    return this.request(endpoint, 'GET', null, headers);
  }

  async post(endpoint, body, headers = {}) {
    return this.request(endpoint, 'POST', body, headers);
  }
}
