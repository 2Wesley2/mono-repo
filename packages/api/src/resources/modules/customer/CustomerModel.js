import mongoose from 'mongoose';
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
        type: mongoose.Schema.Types.ObjectId,
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
    return Customer.findById(id).populate('vouchers');
  }

  findAll(filters = {}, options = {}) {
    return Customer.find(filters, null, options).populate('vouchers');
  }

  async update(id, customerData) {
    try {
      return await Customer.findByIdAndUpdate(id, customerData, {
        new: true,
        runValidators: true,
      }).populate('vouchers');
    } catch (error) {
      throw new Error('Erro ao atualizar o cliente: ' + error.message);
    }
  }
}

export default CustomerModel;
