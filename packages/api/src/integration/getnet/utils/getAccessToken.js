import getnetConfig from '../config/Getnet.js';
import Singleton from '../utils/Singleton.js';
import { UnauthorizedError } from '../errors/Exceptions.js';

const client = new Singleton().getInstance();

const getAccessToken = async () => {
  const BASE_URL = getnetConfig[client.env]?.endpoint;

  if (!BASE_URL) {
    throw new Error(
      `Invalid environment "${client.env}". Supported environments are: ${Object.keys(getnetConfig).join(', ')}.`,
    );
  }
  const params = {
    scope: 'oob',
    grantType: 'client_credentials',
  };

  const headers = {
    Authorization: `Basic ${client.basicAuthtoken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const body = new URLSearchParams(params).toString();

  try {
    const response = await fetch(`${BASE_URL}/auth/oauth/v2/token`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new UnauthorizedError(data);
    }

    return data.accessToken;
  } catch (ex) {
    throw new UnauthorizedError('Failed to retrieve access token');
  }
};

export default getAccessToken;
