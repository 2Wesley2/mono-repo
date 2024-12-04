const apiBaseUrl = 'http://localhost:3001';

/**
 * Centralized HTTP request handler with consistent error handling and logging.
 * @param {string} endpoint - API endpoint to hit (relative to the base URL).
 * @param {string} method - HTTP method (GET, POST, etc.).
 * @param {Object|null} body - Request body (optional).
 * @param {Object} customHeaders - Custom headers to override defaults (optional).
 * @returns {Promise<Object>} - Parsed response data.
 */
export async function request(endpoint, method = 'GET', body = null, customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const fullUrl = `${apiBaseUrl}${endpoint}`;
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
