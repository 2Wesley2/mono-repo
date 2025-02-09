import { FINANCIAL, OWNER } from '#resources/collections/index.js';
import Model from '#src/core/infrastructure/components/base/Model.js';

const financialSchema = {
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  timeFrame: {
    startData: { type: Date, required: true },
    endDate: { type: Date, required: true },
    required: true
  },
  revenueMetrics: {
    grossRevenue: { type: Number, required: true }, // Sale
    netRevenue: { type: Number, required: true }, // Sale, Deduction
    averageTicket: { type: Number, required: true }, // Sale
    totalSales: { type: Number, required: true }, // Sale
    conversionRate: { type: Number, required: true }, // Sale
    required: true
  },
  profitMetrics: {
    netProfit: { type: Number, required: true }, // Sale, Expenses
    grossProfit: { type: Number, required: true }, // Sale, CMV
    finalNetIncome: { type: Number, required: true }, // Net Profit, Tax Provisions, Participations
    required: true
  },
  expenseMetrics: {
    totalExpensesValue: { type: Number, required: true }, // Expenses
    cmv: { type: Number, required: true }, // Purchases, Sale
    purchasesValue: { type: Number, required: true }, // Purchases
    deductions: { type: Number, required: true }, // Deduction
    required: true
  },
  marginMetrics: {
    grossMargin: { type: Number, required: true }, // Gross Profit, Net Revenue
    required: true
  },
  operationalMetrics: {
    operationalResult: { type: Number, required: true }, // Gross Profit, Operational Expenses
    nonOperationalResult: { type: Number, required: true }, // Non-Operational Revenues, Non-Operational Expenses
    beforeTaxProfit: { type: Number, required: true }, // Operational Result, Non-Operational Result
    required: true
  },
  taxMetrics: {
    taxProvisions: { type: Number, required: true }, // Pre-Tax Profit
    participations: { type: Number, required: true }, // LAIR (Before Tax Profit)
    required: true
  },
  roiMetrics: {
    roi: { type: Number, required: true }, // Net Profit, Investment
    percentageROI: { type: Number, required: true }, // Net Profit, Investment
    required: true
  }
};

export default class FinancialModel extends Model {
  constructor() {
    super(financialSchema, FINANCIAL);
  }
  async saveReport(report) {
    return await this.model.create(report);
  }
}
