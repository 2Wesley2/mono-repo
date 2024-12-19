import { handleError } from '../errors/Exceptions.js';

export default class HttpClient {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error('Base URL is required for HttpClient.');
    }
    this.baseUrl = baseUrl;
  }

  async request(endpoint, method, body = null, headers = {}) {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint provided for the HTTP request.');
    }

    const requestBody = body ? JSON.stringify(body) : null;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: requestBody,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          body: data,
        };
        throw new Error(`HTTP Error: ${JSON.stringify(errorDetails)}`);
      }

      return data;
    } catch (error) {
      throw handleError(error);
    }
  }
}
