import Model from '../../core/Model.js';
import { PAYMENT } from '../../constants/index.js';

const paymentSchema = {
  type: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'meal-voucher'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: Object,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
};

class PaymentModel extends Model {
  constructor() {
    super(paymentSchema, PAYMENT);
  }
}
export default PaymentModel;
