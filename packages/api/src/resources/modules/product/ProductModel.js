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
};

class ProductClass extends Model {
  constructor() {
    super(productSchema, PRODUCT);
  }

  async create(data) {
    try {
      const newProduct = this.model.create(data);
      const result = await newProduct;
      debug.logger.info('Product created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Error creating product', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('Invalid ID');
      }
      const product = await this.model.findById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async find(filter = {}) {
    try {
      const products = await this.model.find(filter);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updatedProduct = await this.model.findByIdAndUpdate(id, data, { new: true });
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.model.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductClass;
