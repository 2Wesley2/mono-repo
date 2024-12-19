export default class AccessTokenProvider {
  constructor(httpClient, clientConfig) {
    if (!httpClient || !clientConfig) {
      throw new Error('HttpClient and ClientConfig instances are required for AccessTokenProvider.');
    }

    this.httpClient = httpClient;
    this.clientConfig = clientConfig.client;
  }

  async getAccessToken() {
    const { env, basicAuthToken } = this.clientConfig;
    const BASE_URL = this.httpClient.baseUrl;

    if (!BASE_URL) {
      throw new Error(`Invalid environment "${env}". BASE_URL is not configured.`);
    }

    const headers = {
      Authorization: `Basic ${basicAuthToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = new URLSearchParams({
      scope: 'oob',
      grant_type: 'client_credentials',
    }).toString();

    const response = await this.httpClient.request('/auth/oauth/v2/token', 'POST', body, headers);

    if (!response.access_token) {
      throw new Error('Failed to retrieve access token. Check your credentials or environment.');
    }

    return response.access_token;
  }
}
