import metrics from '../../application/components/financial/metrics/index.js';

export default class GenerateFinancialReport {
  constructor(services) {
    this.sales = services.sales;
    this.stockAudits = services.stockAudits;
    this.investments = services.investments;
    this.expenses = services.expenses;
    this.deductions = services.deductions;
  }

  async reportFinancialMetrics(startDate, endDate) {
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
      this.reportGrossRevenue(startDate, endDate),
      this.reportNetRevenue(startDate, endDate),
      this.reportAverageTicket(startDate, endDate),
      this.reportNetProfit(startDate, endDate),
      this.reportTotalExpensesValue(startDate, endDate),
      this.reportGrossMargin(startDate, endDate),
      this.reportGrossProfit(startDate, endDate),
      this.reportCMV(startDate, endDate),
      this.getTotalSales(startDate, endDate),
      this.getPurchasesValue(startDate, endDate),
    ]);

    const metrics = {
      grossRevenue: grossRevenue,
      netRevenue: netRevenue,
      averageTicket: averageTicket,
      totalSales: totalSales,
      netProfit: netProfit,
      grossProfit: grossProfit,
      totalExpensesValue: totalExpensesValue,
      cmv: cmv,
      purchasesValue: purchasesValue,
      grossMargin: grossMargin,
    };
    return { ...metrics };
  }

  async reportNetProfit(startDate, endDate) {
    //lucro líquido
    const [netRevenue, totalExpensesValue] = await Promise.all([
      this.reportNetRevenue(startDate, endDate),
      this.reportTotalExpensesValue(startDate, endDate),
    ]);
    const netProfit = metrics.profits.calculateNetProfit(netRevenue, totalExpensesValue);
    return netProfit;
  }

  async reportTotalExpensesValue(startDate, endDate) {
    const totalExpensesValue = await this.expenses.aggregateExpensesValueByPeriod(startDate, endDate);
    return totalExpensesValue;
  }

  async reportAverageTicket(startDate, endDate) {
    // ticket médio
    const [grossRevenue, totalSales] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate),
      this.getTotalSales(startDate, endDate),
    ]);
    const averageTicket = metrics.marginsAndPerformance.calculateAverageTicket(grossRevenue, totalSales);
    return averageTicket;
  }

  async reportGrossMargin(startDate, endDate) {
    // margem bruta
    const [grossProfit, netRevenue] = await Promise.all([
      this.reportGrossProfit(startDate, endDate),
      this.reportNetRevenue(startDate, endDate),
    ]);
    const grossMargin = metrics.costsAndExpenses.calculateCMV(grossProfit, netRevenue);
    return grossMargin;
  }

  async reportGrossProfit(startDate, endDate) {
    // lucro bruto
    const [netRevenue, cmv] = await Promise.all([
      this.reportNetRevenue(startDate, endDate),
      this.reportCMV(startDate, endDate),
    ]);
    const grossProfit = metrics.profits.calculateGrossProfit(netRevenue, cmv);
    return grossProfit;
  }

  async reportNetRevenue(startDate, endDate) {
    //receita liquida
    const [grossRevenue, deductions] = await Promise.all([
      this.reportGrossRevenue(startDate, endDate),
      this.reportDeductionsValue(startDate, endDate),
    ]);
    const netRevenue = metrics.revenues.calculateNetRevenue(grossRevenue, deductions);
    return netRevenue;
  }

  async reportDeductionsValue(startDate, endDate) {
    const deductions = await this.deductions.aggregateDeductionsValueByPeriod(startDate, endDate);
    return deductions;
  }

  async reportCMV(startDate, endDate) {
    //custo de mercadorias vendidas
    const [initialCostPriceProductsStock, finalCostPriceProductsStock, purchases] = await Promise.all([
      this.agreggateStockValueByDate(startDate),
      this.agreggateStockValueByDate(endDate),
      this.getPurchasesValue(startDate, endDate),
    ]);
    const cmv = metrics.costsAndExpenses.calculateCMV(
      initialCostPriceProductsStock,
      finalCostPriceProductsStock,
      purchases,
    );
    return cmv;
  }

  async getPurchasesValue(startDate, endDate) {
    const purchasesValues = await this.stockAudits.agreggatePurchasesValueByPeriod(startDate, endDate);
    return purchasesValues;
  }

  async agreggateStockValueByDate(date) {
    const initialCostPriceProductsStock = await this.stockAudits.agreggateStockValueAtDate(date);
    return initialCostPriceProductsStock;
  }

  async getTotalSales(startDate, endDate) {
    const totalSales = await this.sales.countSalesByPeriod(startDate, endDate);
    return totalSales;
  }

  async reportGrossRevenue(startDate, endDate) {
    // receita bruta
    const salesValues = await this.getSalesValues(startDate, endDate);
    const grossRevenue = metrics.revenues.calculateGrossRevenue(salesValues);
    return grossRevenue;
  }

  async getSalesValues(startDate, endDate) {
    const salesValues = await this.sales.getSalesValuesByPeriod(startDate, endDate);
    return salesValues;
  }
}
