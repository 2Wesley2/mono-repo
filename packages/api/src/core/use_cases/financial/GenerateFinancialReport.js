import metrics from '../../application/components/financial/metrics/index.js';

class GenerateFinancialReport {
  static async reportFinancialMetrics(startDate, endDate, services) {
    const { sale, expense, deduction, purchase, product } = services;

    const servicesByNetRevenue = {
      sale,
      deduction
    };

    const servicesByNetProfit = {
      ...servicesByNetRevenue,
      expense
    };

    const servicesByCMV = { purchase, product };

    const servicesByGrossMarginAndGrossProfit = {
      ...servicesByNetRevenue,
      ...servicesByCMV
    };

    const [
      totalSales,
      grossRevenue,
      averageTicket,
      totalExpensesValue,
      purchasesValue,
      netRevenue,
      netProfit,
      cmv,
      grossMargin,
      grossProfit
    ] = await Promise.all([
      this.getTotalSales(startDate, endDate, sale),
      this.reportGrossRevenue(startDate, endDate, sale),
      this.reportAverageTicket(startDate, endDate, sale),
      this.reportTotalExpensesValue(startDate, endDate, expense),
      this.getPurchasesValue(startDate, endDate, purchase),
      this.reportNetRevenue(startDate, endDate, servicesByNetRevenue),
      this.reportNetProfit(startDate, endDate, servicesByNetProfit),
      this.reportCMV(startDate, endDate, servicesByCMV),
      this.reportGrossMargin(startDate, endDate, servicesByGrossMarginAndGrossProfit),
      this.reportGrossProfit(startDate, endDate, servicesByGrossMarginAndGrossProfit)
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
      grossMargin
    };
  }

  static async reportNetProfit(startDate, endDate, services) {
    const [netRevenue, totalExpensesValue] = await Promise.all([
      this.reportNetRevenue(startDate, endDate, {
        sale: services.sale,
        deduction: services.deduction
      }),
      this.reportTotalExpensesValue(startDate, endDate, {
        expense: services.expense
      })
    ]);
    return metrics.profits.calculateNetProfit(netRevenue, totalExpensesValue);
  }

  static async reportAverageTicket(startDate, endDate, services) {
    const [grossRevenue, totalSales] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate, services),
      this.getTotalSales(startDate, endDate, services)
    ]);
    return metrics.marginsAndPerformance.calculateAverageTicket(grossRevenue, totalSales);
  }

  static async reportGrossMargin(startDate, endDate, services) {
    const [grossProfit, netRevenue] = await Promise.all([
      this.reportGrossProfit(startDate, endDate, services),
      this.reportNetRevenue(startDate, endDate, services)
    ]);
    return metrics.marginsAndPerformance.calculateGrossMargin(grossProfit, netRevenue);
  }

  static async reportGrossProfit(startDate, endDate, services) {
    const [netRevenue, cmv] = await Promise.all([
      this.reportNetRevenue(startDate, endDate, services),
      this.reportCMV(startDate, endDate, services)
    ]);
    return metrics.profits.calculateGrossProfit(netRevenue, cmv);
  }

  static async reportNetRevenue(startDate, endDate, services) {
    const [grossRevenue, deductions] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate, { sale: services.sale }),
      this.reportDeductionsValue(startDate, endDate, {
        deduction: services.deduction
      })
    ]);
    return metrics.revenues.calculateNetRevenue(grossRevenue, deductions);
  }

  static async reportCMV(startDate, endDate, services) {
    const [initialStock, finalStock, purchases] = await Promise.all([
      this.aggregateStockValueByDate(startDate, { product: services.product }),
      this.aggregateStockValueByDate(endDate, { product: services.product }),
      this.getPurchasesValue(startDate, endDate, {
        purchase: services.purchase
      })
    ]);
    return metrics.costsAndExpenses.calculateCMV(initialStock, finalStock, purchases);
  }

  static async reportGrossRevenue(startDate, endDate, sale) {
    const salesValues = await this.getSalesValues(startDate, endDate, sale);
    return metrics.revenues.calculateGrossRevenue(salesValues);
  }

  //Handle Services
  static async reportDeductionsValue(startDate, endDate, deduction) {
    return await deduction.aggregateDeductionsValueByPeriod(startDate, endDate);
  }
  static async reportTotalExpensesValue(startDate, endDate, expense) {
    return await expense.aggregateExpensesValueByPeriod(startDate, endDate);
  }

  static async getPurchasesValue(startDate, endDate, purchase) {
    return await purchase.aggregatePurchasesValueByPeriod(startDate, endDate);
  }

  static async aggregateStockValueByDate(date, product) {
    return await product.aggregateStockValueAtDate(date);
  }

  static async getTotalSales(startDate, endDate, sale) {
    return await sale.countSalesByPeriod(startDate, endDate);
  }

  static async getSalesValues(startDate, endDate, sale) {
    return await sale.getSalesValuesByPeriod(startDate, endDate);
  }
}
export default {
  reportFinancialMetrics: (...args) => GenerateFinancialReport.reportFinancialMetrics(...args)
};
