import { request } from './apiRequest';

const OrderService = {
  create: async (orderData) => request('/order', 'POST', orderData),

  bulkCreate: async (ordersData) =>
    request('/order/bulk', 'POST', ordersData),

  listProductsByOrder: async (orderNumber) =>
    request(`/order/${orderNumber}/products`, 'GET'),

  updateOrderContent: async (orderNumber, products) =>
    request(`/order/${orderNumber}/order`, 'PUT', products),
};

export default OrderService;
