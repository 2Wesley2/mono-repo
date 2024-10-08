import mongoose from 'mongoose';
import Database from '../../../database/index.js';

const orderSchema = Database.registerModel({
  schema: {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: [1, 'A quantidade deve ser pelo menos 1'] },
      },
    ],
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'canceled'],
      default: 'pending',
    },
    totalAmount: { type: Number, required: true, min: [0, 'O valor total não pode ser negativo'] },
  },
});

class OrderModel {
  constructor() {
    this.Order = orderSchema;
  }

  create(orderData) {
    const order = new this.Order(orderData);
    return order.save();
  }

  findById(id) {
    return this.Order.findById(id).populate('products.product').populate('payment');
  }

  findAll(filters = {}, options = {}) {
    return this.Order.find(filters, null, options).populate('products.product').populate('payment');
  }

  update(id, orderData) {
    return this.Order.findByIdAndUpdate(id, orderData, { new: true, runValidators: true })
      .populate('products.product')
      .populate('payment');
  }

  delete(id) {
    return this.Order.findByIdAndDelete(id);
  }
}

export default OrderModel;
