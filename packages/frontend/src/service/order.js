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
    return request('/api/order', 'POST', orderData);
  },

  bulkCreate: async (ordersData) => {
    return request('/api/order/bulk', 'POST', ordersData);
  },

  modifyProduct: async (orderNumber, operation, products) => {
    const body = { operation, products };
    console.log(
      'JSON enviado para o backend em modifyProduct:',
      JSON.stringify(body, null, 2),
    );
    return request(`/api/order/${orderNumber}/product`, 'PUT', body);
  },

  listProductsByOrder: async (orderNumber) => {
    const response = await request(`/api/order/${orderNumber}/products`, 'GET');
    return response?.data?.products || [];
  },

  listOrders: async (filter = {}) => {
    const query = new URLSearchParams(filter).toString();
    return request(`/api/order?${query}`, 'GET');
  },

  delete: async (orderId) => {
    return request(`/api/order/${orderId}`, 'DELETE');
  },
};

export default OrderService;
