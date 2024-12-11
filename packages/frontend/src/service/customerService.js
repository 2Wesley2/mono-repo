import { request } from './apiRequest';

const CustomerService = {
  register: async (customerData) =>
    request('/customer/register', 'POST', customerData),

  getAll: async () => request('/customer/all', 'GET'),

  updateCustomer: async (customerId, customerData) =>
    request(`/customer/${customerId}`, 'PUT', customerData),

  deleteCustomer: async (customerId) =>
    request(`/customer/${customerId}`, 'DELETE'),
};

export default CustomerService;
