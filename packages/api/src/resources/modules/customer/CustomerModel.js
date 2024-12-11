import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { CUSTOMER, REWARD } from '../../constants/index.js';
import loaders from '../../../loaders/index.js';

const customerSchema = {
  name: { type: String, required: true },
  cpf: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true, required: true },
  rewards: { type: loaders.mongoose.getObjectId(), ref: REWARD, unique: true },
  lifetimeValue: { type: Number, default: 0 },
};

class CustomerModel extends Model {
  constructor() {
    super(customerSchema, CUSTOMER);
  }
  async createCustomer(customerData) {
    return await this.model.create(customerData);
  }

  async getCustomerById(customerId) {
    return await this.model.findById(customerId);
  }

  async listAllCustomers() {
    return await this.model.find().populate('rewards').lean();
  }

  async updateCustomer(id, updateData) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteCustomer(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default CustomerModel;
