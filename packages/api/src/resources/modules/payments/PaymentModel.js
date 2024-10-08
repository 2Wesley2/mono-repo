import Database from '../../../database/index.js';

const paymentSchema = Database.registerModel({
  schema: {
    preferenceId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    successUrl: {
      type: String,
      required: true,
    },
    failureUrl: {
      type: String,
      required: true,
    },
    pendingUrl: {
      type: String,
      required: true,
    },
  },
});

class PaymentModel {
  constructor() {
    this.Payment = paymentSchema;
  }

  create(paymentData) {
    const payment = new this.Payment(paymentData);
    return payment.save();
  }

  findById(id) {
    return this.Payment.findById(id);
  }

  update(id, paymentData) {
    return this.Payment.findByIdAndUpdate(id, paymentData, { new: true, runValidators: true });
  }

  delete(id) {
    return this.Payment.findByIdAndDelete(id);
  }
}

export default PaymentModel;
