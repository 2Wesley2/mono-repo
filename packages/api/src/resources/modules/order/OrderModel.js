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
              if (v <= 0) throw new Error('Product quantity must be greater than zero');
              return true;
            },
            message: 'Product quantity must be greater than zero',
          },
        },
      },
    ],
    validate: {
      validator: function (products) {
        if (this.status === 'Stand By' && products.length > 0) {
          throw new Error('Orders with status "Stand By" cannot have products.');
        }
        return true;
      },
    },
  },
};

class OrderModel extends Model {
  constructor() {
    super(orderSchema, ORDER);
  }

  async createOrder(data) {
    const newOrder = await this.model.create(data);
    return newOrder;
  }

  async bulkCreate(data) {
    const result = await this.model.insertMany(data);
    return result;
  }

  async findByIdInModel(id) {
    if (!Database.isValidObjectId(id)) {
      throw new Error('Invalid ID');
    }
    const order = await this.model.findById(id);
    return order;
  }

  async find(filter = {}) {
    try {
      const orders = await this.model.find(filter);
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findByOrderNumberModel(orderNumber) {
    if (typeof orderNumber === 'object' && orderNumber.orderNumber) {
      orderNumber = orderNumber.orderNumber;
    }
    const parsedOrderNumber = Number(orderNumber);
    if (isNaN(parsedOrderNumber)) {
      throw new Error(`Invalid orderNumber: ${orderNumber}`);
    }
    const order = await this.model.findOne({ orderNumber });
    return order;
  }

  async updateOrderModel(id, data) {
    const updatedOrder = await this.model.findOneAndUpdate({ _id: id }, data, { new: true });
    if (!updatedOrder) {
      throw new Error(`Order with number ${orderNumber} not found`);
    }
    return updatedOrder;
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
