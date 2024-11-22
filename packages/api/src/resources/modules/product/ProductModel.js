import Database from '../../../database/index.js';
import debug from '../../../debug/index.js';
import Model from '../../core/Model.js';
import { PRODUCT } from '../../constants/index.js';

const productSchema = {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['ready_to_sell', 'made_in_house'], required: true },
  quantity: {
    type: Number,
    required: function () {
      return this.type === 'ready_to_sell';
    },
    validate: {
      validator: function (v) {
        return this.type === 'made_in_house' || v >= 0;
      },
      message: 'Quantity cannot be negative for "ready_to_sell" products',
    },
  },
  category: { type: String, required: false },
  barcode: { type: String, unique: true, required: true },
};

class ProductModel extends Model {
  constructor() {
    super(productSchema, PRODUCT);
  }

  async create(data) {
    try {
      debug.logger.debug('Creating product with data:', { data });
      const newProduct = this.model.create(data);
      const result = await newProduct;
      debug.logger.info('Product created successfully', { result });
      return result;
    } catch (error) {
      debug.logger.error('Error creating product', { error: error.message, stack: error.stack, data });
      throw error;
    }
  }

  async bulkCreate(productList) {
    try {
      const result = await this.model.insertMany(productList);
      debug.logger.info('Model: Products created in bulk successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Model: Error creating products in bulk', { error });
      throw error;
    }
  }
  async findByIdInModel(id) {
    const product = await this.model.findById(id);
    return product;
  }

  async findByCategory(category) {
    const products = await this.model.find({ category });
    return products;
  }

  async update(id, data) {
    try {
      debug.logger.debug('Updating product', { id, data });
      const updatedProduct = await this.model.findByIdAndUpdate(id, data, { new: true });
      debug.logger.info('Product updated successfully', { id, updatedProduct });
      return updatedProduct;
    } catch (error) {
      debug.logger.error('Error updating product', { error: error.message, id, data });
      throw error;
    }
  }

  async delete(id) {
    try {
      debug.logger.debug('Deleting product by ID', { id });
      await this.model.findByIdAndDelete(id);
      debug.logger.info('Product deleted successfully', { id });
      return true;
    } catch (error) {
      debug.logger.error('Error deleting product', { error: error.message, id });
      throw error;
    }
  }
}

export default ProductModel;
