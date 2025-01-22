import metrics from '../../application/components/financial/metrics/index.js';

class GenerateFinancialReport {
  static async reportFinancialMetrics(startDate, endDate, services) {
    const [
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
    ] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate, services),
      this.reportNetRevenue(startDate, endDate, services),
      this.reportAverageTicket(startDate, endDate, services),
      this.reportNetProfit(startDate, endDate, services),
      this.reportTotalExpensesValue(startDate, endDate, services),
      this.reportGrossMargin(startDate, endDate, services),
      this.reportGrossProfit(startDate, endDate, services),
      this.reportCMV(startDate, endDate, services),
      this.getTotalSales(startDate, endDate, services),
      this.getPurchasesValue(startDate, endDate, services),
    ]);

    return {
      grossRevenue,
      netRevenue,
      averageTicket,
      totalSales,
      netProfit,
      grossProfit,
      totalExpensesValue,
      cmv,
      purchasesValue,
      grossMargin,
    };
  }

  static async reportNetProfit(startDate, endDate, services) {
    const [netRevenue, totalExpensesValue] = await Promise.all([
      this.reportNetRevenue(startDate, endDate, services),
      this.reportTotalExpensesValue(startDate, endDate, services),
    ]);
    return metrics.profits.calculateNetProfit(netRevenue, totalExpensesValue);
  }

  static async reportTotalExpensesValue(startDate, endDate, services) {
    return await services.expenses.aggregateExpensesValueByPeriod(startDate, endDate);
  }

  static async reportAverageTicket(startDate, endDate, services) {
    const [grossRevenue, totalSales] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate, services),
      this.getTotalSales(startDate, endDate, services),
    ]);
    return metrics.marginsAndPerformance.calculateAverageTicket(grossRevenue, totalSales);
  }

  static async reportGrossMargin(startDate, endDate, services) {
    const [grossProfit, netRevenue] = await Promise.all([
      this.reportGrossProfit(startDate, endDate, services),
      this.reportNetRevenue(startDate, endDate, services),
    ]);
    return metrics.costsAndExpenses.calculateCMV(grossProfit, netRevenue);
  }

  static async reportGrossProfit(startDate, endDate, services) {
    const [netRevenue, cmv] = await Promise.all([
      this.reportNetRevenue(startDate, endDate, services),
      this.reportCMV(startDate, endDate, services),
    ]);
    return metrics.profits.calculateGrossProfit(netRevenue, cmv);
  }

  static async reportNetRevenue(startDate, endDate, services) {
    const [grossRevenue, deductions] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate, services),
      this.reportDeductionsValue(startDate, endDate, services),
    ]);
    return metrics.revenues.calculateNetRevenue(grossRevenue, deductions);
  }

  static async reportDeductionsValue(startDate, endDate, services) {
    return await services.deductions.aggregateDeductionsValueByPeriod(startDate, endDate);
  }

  static async reportCMV(startDate, endDate, services) {
    const [initialStock, finalStock, purchases] = await Promise.all([
      this.aggregateStockValueByDate(startDate, services),
      this.aggregateStockValueByDate(endDate, services),
      this.getPurchasesValue(startDate, endDate, services),
    ]);
    return metrics.costsAndExpenses.calculateCMV(initialStock, finalStock, purchases);
  }

  static async getPurchasesValue(startDate, endDate, services) {
    return await services.stockAudits.aggregatePurchasesValueByPeriod(startDate, endDate);
  }

  static async aggregateStockValueByDate(date, services) {
    return await services.stockAudits.aggregateStockValueAtDate(date);
  }

  static async getTotalSales(startDate, endDate, services) {
    return await services.sales.countSalesByPeriod(startDate, endDate);
  }

  static async reportGrossRevenue(startDate, endDate, services) {
    const salesValues = await this.getSalesValues(startDate, endDate, services);
    return metrics.revenues.calculateGrossRevenue(salesValues);
  }

  static async getSalesValues(startDate, endDate, services) {
    return await services.sales.getSalesValuesByPeriod(startDate, endDate);
  }
}
export default {
  reportFinancialMetrics: (...args) => GenerateFinancialReport.reportFinancialMetrics(...args),
};
