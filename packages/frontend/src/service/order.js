import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

const headers = {
  'Content-Type': 'application/json',
};

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`HTTP ${response.status} - ${errorMessage}`);
  }

  return response.json();
}

const OrderService = {
  create: async (orderData) => {
    return request('/', 'POST', orderData);
  },

  bulkCreate: async (ordersData) => {
    return request('/bulk', 'POST', ordersData);
  },

  addProduct: async (orderId, productData) => {
    return request(`/${orderId}/product`, 'PUT', productData);
  },

  removeProduct: async (orderId, productId) => {
    return request(`/${orderId}/product/${productId}`, 'DELETE');
  },

  listOrders: async (filter = {}) => {
    const query = new URLSearchParams(filter).toString();
    return request(`/?${query}`, 'GET');
  },

  delete: async (orderId) => {
    return request(`/${orderId}`, 'DELETE');
  },
};

export default OrderService;
