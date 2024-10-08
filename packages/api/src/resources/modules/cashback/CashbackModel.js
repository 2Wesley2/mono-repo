import Database from '../../../database/index.js';

const Cashback = Database.registerModel({
  schema: {
    customerId: {
      type: Database.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'O valor do cashback não pode ser negativo'],
    },
    dateIssued: {
      type: Date,
      default: Date.now,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  modelName: 'Cashback',
  options: {
    timestamps: true,
  },
});

class CashbackModel {
  async create(data) {
    const cashback = new Cashback(data);
    return await cashback.save();
  }

  findByCustomer(customerId) {
    return Cashback.find({ customerId, used: false });
  }

  markAsUsed(cashbackId) {
    return Cashback.findByIdAndUpdate(cashbackId, { used: true }, { new: true });
  }
}

export default CashbackModel;
