import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

const headers = {
  'Content-Type': 'application/json',
};

function logElegant(type, details) {
  console.group(`🔍 ${type}`);
  console.table(details);
  console.groupEnd();
}

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  logElegant('Request', {
    Endpoint: `${apiBaseUrl}${endpoint}`,
    Method: method,
    Headers: JSON.stringify(headers),
    Body: body || 'N/A',
  });

  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

  if (!response.ok) {
    const errorMessage = await response.text();
    logElegant('Response Error', {
      Status: response.status,
      Error: errorMessage,
    });
    throw new Error(`HTTP ${response.status} - ${errorMessage}`);
  }

  const responseData = await response.json();

  // Logando a resposta
  logElegant('Response', {
    Status: response.status,
    Data: responseData,
  });

  return responseData;
}

const OrderService = {
  create: async (orderData) => {
    return request('/api/order', 'POST', orderData);
  },

  bulkCreate: async (ordersData) => {
    return request('/api/order/bulk', 'POST', ordersData);
  },

  listProductsByOrder: async (orderNumber) => {
    const response = await request(`/api/order/${orderNumber}/products`, 'GET');
    return response?.data?.products || [];
  },

  updateOrderContent: async (orderNumber, { updateFields }) => {
    const response = await request(`/api/order/${orderNumber}/product`, 'PUT', {
      updateFields,
    });
    return response;
  },
};

export default OrderService;
