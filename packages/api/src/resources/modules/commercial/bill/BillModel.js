import Model from '../../../../core/infrastructure/components/base/Model.js';
import bill from '#src/core/entities/domain/bill/Bill.js';
import { OWNER, BILL, PRODUCT } from '../../../collections/index.js';

const billSchema = {
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  billNumber: {
    type: Number,
    required: true,
    validate: {
      validator: async function (value) {
        const exists = await this.constructor.exists({
          ownerId: this.ownerId,
          billNumber: value,
        });
        return !exists;
      },
      message: 'Cada Owner deve ter números de Bill únicos.',
    },
  },
  status: { type: String, enum: ['Stand By', 'In Progress'], default: 'Stand By' },
  amount: {
    type: Number,
    required: true,
    default: 0,
    validate: { validator: (value) => value >= 0 },
  },
  products: [
    {
      name: { type: Model.objectIdType, ref: PRODUCT, required: true },
      quantity: {
        type: Number,
        required: true,
        default: 0,
        validate: { validator: (v) => v >= 0 },
      },
    },
  ],
};

export default class BillModel extends Model {
  constructor() {
    super(billSchema, BILL);
  }

  async createBill(data) {
    return await this.model.create(data);
  }

  async bulkCreateBills(data) {
    return await this.model.insertMany(data);
  }

  async updateBillProducts(ownerId, billNumber, updatedProducts) {
    const pipeline = bill.buildUpdateBillPipeline({ ownerId, billNumber, updatedProducts });
    const updatedBill = await this.model.aggregate([...pipeline]);
    return updatedBill;
  }

  async getProductsByBill(ownerId, billNumber) {
    const pipeline = bill.buildFetchProductsPipeline(ownerId, billNumber);
    const products = await this.model.aggregate([...pipeline]);
    return products;
  }
}
