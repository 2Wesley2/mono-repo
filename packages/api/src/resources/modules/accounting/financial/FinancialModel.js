import { FINANCIAL } from '../../../collections/index.js';
import Model from '../../../../core/entities/system/base/Model.js';

const financialSchema = {
  revenueMetrics: {
    grossRevenue: { type: Number, required: true },
    netRevenue: { type: Number, required: true },
    averageTicket: { type: Number, required: true },
    totalSales: { type: Number, required: true },
  },
  profitMetrics: {
    netProfit: { type: Number, required: true },
    grossProfit: { type: Number, required: true },
  },
  expenseMetrics: {
    totalExpensesValue: { type: Number, required: true },
    cmv: { type: Number, required: true },
    purchasesValue: { type: Number, required: true },
  },
  marginMetrics: {
    grossMargin: { type: Number, required: true },
  },
};

export default class FinancialModel extends Model {
  constructor() {
    super(financialSchema, FINANCIAL);
  }
  async saveReport(report) {
    return await this.model.create(report);
  }
}
