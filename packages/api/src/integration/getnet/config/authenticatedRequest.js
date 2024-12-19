import ClientModel from '../models/ClientModel.js';
import ClientConfig from '../utils/ClientConfig.js';
import HttpClient from '../utils/HttpClient.js';
import AccessTokenProvider from '../services/AccessTokenProvider.js';
import AuthenticatedRequest from '../services/AuthenticatedRequest.js';
import config from '../../../config/index.js';

const clientModel = new ClientModel({
  sellerId: config.getnetSellerId,
  clientId: config.getnetClientId,
  secret: config.getnetSecret,
  env: config.getnetEnv,
});

const clientConfig = new ClientConfig(clientModel);

const BASE_URLS = {
  sandbox: config.getnetUrlSandbox,
  production: config.getnetUrlProduction,
  homolog: config.getnetUrlHomolog,
};

const BASE_URL = BASE_URLS[clientConfig.client.env];
if (!BASE_URL) {
  throw new Error(`Invalid environment "${clientConfig.client.env}". Check your configuration.`);
}
const httpClient = new HttpClient(BASE_URL);
const tokenProvider = new AccessTokenProvider(httpClient, clientConfig);
const authenticatedRequest = new AuthenticatedRequest(httpClient, tokenProvider, clientConfig);
export { authenticatedRequest };
