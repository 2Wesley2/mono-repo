import Model from '../../core/Model.js';

const salesSchema = {
  clientCPF: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  ticketApplied: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
};

class SalesModel extends Model {
  constructor() {
    super(salesSchema, 'Sales');
  }
}

export default SalesModel;
