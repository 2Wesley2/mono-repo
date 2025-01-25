import Model from '#core/infrastructure/components/base/Model.js';
import { CUSTOMER, BUSINESS } from '#resources/collections/index.js';

const customerSchema = {
  businessID: { type: Model.objectIdType, ref: BUSINESS, required: true },
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
};

export default class CustomerModel extends Model {
  constructor() {
    super(customerSchema, CUSTOMER);
  }

  async createCustomer(customerData) {
    return await this.model.create(customerData);
  }

  async getCustomerById(customerId) {
    return await this.model.findById(customerId);
  }

  async updateCustomer(id, updateData) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteCustomer(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
