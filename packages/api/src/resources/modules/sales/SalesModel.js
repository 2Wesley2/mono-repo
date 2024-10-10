import Database from '../../../database/index.js';
import mongoose from 'mongoose';

const Sale = Database.registerModel({
  schema: {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'O ID do cliente é obrigatório'],
    },
    fuelType: {
      type: String,
      enum: ['gasolina', 'alcool'],
      required: [true, 'O tipo de combustível é obrigatório'],
    },
    amount: {
      type: Number,
      required: [true, 'O valor da venda é obrigatório'],
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    cashbackUsed: {
      type: Number,
      default: 0,
    },
    voucherUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
      required: false,
    },
    voucherDiscount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
  },
  modelName: 'Sale',
  options: {
    timestamps: true,
  },
});

class SaleModel {
  async create(saleData) {
    try {
      const sale = new Sale(saleData);
      return await sale.save();
    } catch (error) {
      throw new Error('Erro ao registrar a venda: ' + error.message);
    }
  }

  findById(id) {
    return Sale.findById(id);
  }

  findAll(filters = {}, options = {}) {
    return Sale.find(filters, null, options);
  }

  async update(id, saleData) {
    try {
      return await Sale.findByIdAndUpdate(id, saleData, {
        new: true,
        runValidators: true,
      }).populate('voucherUsed');
    } catch (error) {
      throw new Error('Erro ao atualizar a venda: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await Sale.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar a venda: ' + error.message);
    }
  }
}

export default SaleModel;
