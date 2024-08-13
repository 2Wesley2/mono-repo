import mongoose from 'mongoose';
import Database from '../../../database/index.js';

const productSchema = Database.configSchema({
  schema: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
});

class ProductModel {
  constructor() {
    this.Product = mongoose.model('Product', productSchema);
  }

  create(productData) {
    const product = new this.Product(productData);
    return product.save();
  }

  findById(id) {
    return this.Product.findById(id);
  }

  update(id, productData) {
    return this.Product.findByIdAndUpdate(id, productData, { new: true });
  }

  delete(id) {
    return this.Product.findByIdAndDelete(id);
  }
}

export default new ProductModel();
