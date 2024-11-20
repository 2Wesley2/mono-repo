import Database from '../../../database/index.js';
import debug from '../../../debug/index.js';
import Model from '../../core/Model.js';
import { ORDER, PRODUCT } from '../../constants/index.js';

const orderSchema = {
  orderNumber: { type: Number, unique: true, required: true },
  status: { type: String, enum: ['Stand By', 'In Progress'], default: 'Stand By' },
  products: {
    type: [
      {
        product: { type: Database.ObjectId, ref: PRODUCT, required: true },
        quantity: {
          type: Number,
          required: true,
          validate: {
            validator: function (v) {
              return v > 0;
            },
            message: 'Product quantity must be greater than zero',
          },
        },
      },
    ],
    validate: {
      validator: function (products) {
        if (this.status === 'Stand By' && products.length > 0) {
          return false;
        }
        return true;
      },
      message: 'Orders with status "Stand By" cannot have products.',
    },
  },
};

class OrderModel extends Model {
  constructor() {
    super(orderSchema, ORDER);
    console.log('Model: this.model = ', this.model);
    console.log('Model: this.model.bulkCreate = ', this.model.bulkCreate);
  }
  async create(data) {
    try {
      const newOrder = this.model.create(data);
      const result = await newOrder;
      debug.logger.info('Order created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Error creating order', { error });
      throw error;
    }
  }

  async bulkCreate(data) {
    try {
      const result = await this.model.insertMany(data);
      debug.logger.info('Model: Bulk orders created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Model: Error creating bulk orders', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!Database.isValidObjectId(id)) {
        throw new Error('Invalid ID');
      }
      const order = await this.model.findById(id);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async find(filter = {}) {
    try {
      const orders = await this.model.find(filter);
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updatedOrder = await this.model.findByIdAndUpdate(id, data, { new: true });
      return updatedOrder;
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

export default OrderModel;
