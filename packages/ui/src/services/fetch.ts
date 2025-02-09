import { RequestParams } from '../types/request-params';

const apiBaseUrl = 'http://localhost:3000';

export async function request<T>({ endpoint, method, body, headers, queryParams, ...rest }: RequestParams): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  const options: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest
  };

  const queryString = queryParams ? '?' + new URLSearchParams(queryParams).toString() : '';

  const fullUrl = `${apiBaseUrl}${endpoint}${queryString}`;
  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorMessage}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
