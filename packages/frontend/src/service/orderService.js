import { request } from './apiRequest';

const OrderService = {
  create: async (orderData) => request('/api/order', 'POST', orderData),

  bulkCreate: async (ordersData) =>
    request('/api/order/bulk', 'POST', ordersData),

  listProductsByOrder: async (orderNumber) =>
    request(`/api/order/${orderNumber}/products`, 'GET'),

  updateOrderContent: async (orderNumber, products) =>
    request(`/api/order/${orderNumber}/order`, 'PUT', products),
};

export default OrderService;
