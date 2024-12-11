class CustomerRepository {
  constructor(model) {
    this.model = model;
  }

  async createCustomer(customerData) {
    return await this.model.createCustomer(customerData);
  }

  async getCustomerById(customerId) {
    return await this.model.getCustomerById(customerId);
  }

  async listAllCustomers() {
    return await this.model.listAllCustomers();
  }

  async updateCustomer(id, updateData) {
    return await this.model.updateCustomer(id, updateData);
  }

  async deleteCustomer(id) {
    return await this.model.deleteCustomer(id);
  }
}

export default CustomerRepository;
