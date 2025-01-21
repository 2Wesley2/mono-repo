import financial from '../../../../core/application/components/financial/metrics/index.js';
export default class FinancialRepository {
  constructor(model) {
    this.model = model;
  }

  async consolidateReport(metrics, timeFrame) {
    const reportMetricsIsNumber = (object) =>
      Object.values(object).reduce((isValid, value) => isValid && typeof value === 'number', true);

    if (!reportMetricsIsNumber(metrics)) {
      throw new Error('All report metrics must be numbers');
    }
    const { startDate, endDate } = timeFrame;
    const {
      grossRevenue,
      netRevenue,
      averageTicket,
      netProfit,
      totalExpensesValue,
      grossMargin,
      grossProfit,
      cmv,
      totalSales,
      purchasesValue,
    } = metrics;

    const report = {
      timeFrame: { startDate: startDate, endDate: endDate },
      revenueMetrics: {
        grossRevenue: grossRevenue,
        netRevenue: netRevenue,
        averageTicket: averageTicket,
        totalSales: totalSales,
      },
      profitMetrics: {
        netProfit: netProfit,
        grossProfit: grossProfit,
      },
      expenseMetrics: {
        totalExpensesValue: totalExpensesValue,
        cmv: cmv,
        purchasesValue: purchasesValue,
      },
      marginMetrics: {
        grossMargin: grossMargin,
      },
    };

    return await this.model.saveReport(report);
  }
}
