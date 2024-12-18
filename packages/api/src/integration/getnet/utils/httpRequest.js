import getnetConfig from '../config/Getnet.js';
import Singleton from './Singleton.js';

const client = new Singleton().getInstance();
const BASE_URL = getnetConfig[client.env].endpoint;

const httpRequest = async (url, method, body = null, headers = {}) => {
  const requestBody = body ? JSON.stringify(body) : null;

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: requestBody,
  });

  const jsonResponse = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(jsonResponse));
  }

  return jsonResponse;
};

export default httpRequest;
