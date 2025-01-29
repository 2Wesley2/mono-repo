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
      totalSales,
      conversionRate,
      netProfit,
      grossProfit,
      finalNetIncome,
      totalExpensesValue,
      cmv,
      purchasesValue,
      deductions,
      grossMargin,
      operationalResult,
      nonOperationalResult,
      beforeTaxProfit,
      taxProvisions,
      participations,
      roi,
      percentageROI,
    } = metrics;

    const report = {
      timeFrame: { startDate: startDate, endDate: endDate },
      revenueMetrics: {
        grossRevenue,
        netRevenue,
        averageTicket,
        totalSales,
        conversionRate,
      },
      profitMetrics: {
        netProfit,
        grossProfit,
        finalNetIncome,
      },
      expenseMetrics: {
        totalExpensesValue,
        cmv,
        purchasesValue,
        deductions,
      },
      marginMetrics: {
        grossMargin,
      },
      operationalMetrics: {
        operationalResult,
        nonOperationalResult,
        beforeTaxProfit,
      },
      taxMetrics: {
        taxProvisions,
        participations,
      },
      roiMetrics: {
        roi,
        percentageROI,
      },
    };

    return await this.model.saveReport(report);
  }
}
