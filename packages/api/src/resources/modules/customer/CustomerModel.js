import Database from '../../../database/index.js';

const Customer = Database.registerModel({
  schema: {
    name: {
      type: String,
      required: [true, 'O nome do cliente é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O email do cliente é obrigatório'],
      unique: true,
      trim: true,
    },
    vouchers: [
      {
        type: Database.ObjectId,
        ref: 'Voucher',
      },
    ],
  },
  modelName: 'Customer',
  options: {
    timestamps: true,
  },
});

class CustomerModel {
  async create(customerData) {
    try {
      const customer = new Customer(customerData);
      return await customer.save();
    } catch (error) {
      throw new Error('Erro ao criar o cliente: ' + error.message);
    }
  }

  findById(id) {
    return Customer.findById(id);
  }

  findAll(filters = {}, options = {}) {
    return Customer.find(filters, null, options);
  }

  async update(id, customerData) {
    try {
      return await Customer.findByIdAndUpdate(id, customerData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error('Erro ao atualizar o cliente: ' + error.message);
    }
  }

  async delete(id) {
    try {
      const result = await Customer.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Cliente não encontrado.');
      }
      return result;
    } catch (error) {
      throw new Error('Erro ao deletar o cliente: ' + error.message);
    }
  }
}

export default CustomerModel;
