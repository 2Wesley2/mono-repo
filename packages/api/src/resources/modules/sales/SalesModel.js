import mongoose from 'mongoose';
import Database from '../../../database/index.js';

const salesSchema = Database.configSchema({
  schema: {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
});

class SalesModel {
  constructor() {
    this.Sales = mongoose.model('Sales', salesSchema);
  }

  create(salesData) {
    const sales = new this.Sales(salesData);
    return sales.save();
  }

  findById(id) {
    return this.Sales.findById(id).populate('products.product');
  }

  find() {
    return this.Sales.find().populate('products.product');
  }

  update(id, salesData) {
    return this.Sales.findByIdAndUpdate(id, salesData, { new: true });
  }

  delete(id) {
    return this.Sales.findByIdAndDelete(id);
  }
}

export default new SalesModel();
