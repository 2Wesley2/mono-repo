export default class Financial {
  constructor({ financialMetrics }) {
    this.financialMetrics = financialMetrics;
  }

  financialMetricsSummary(sales) {
    const { amount, totalSales, quantityVisitors, totalCosts, totalExpenses, investment } = sales;
    const totalRevenue = this.financialMetrics.calculateTotalRevenue(amount);
    const grossMargin = this.financialMetrics.calculateGrossMargin(totalRevenue);
    const avarageTicket = this.financialMetrics.calculateAvarageTicket(totalRevenue, totalSales);
    const conversionRate = this.financialMetrics.calculateConversionRate(quantityVisitors, totalSales);
    const netRevenue = this.financialMetrics.calculateNetRevenue(totalRevenue, totalCosts);
    const netProfit = this.financialMetrics.calculateNetProfit(netRevenue, totalExpenses);
    const roi = this.financialMetrics.calculateROI(netProfit, investment);
    const percentageRoi = this.financialMetrics.calculatePercentageROI(netProfit, investment);

    return {
      totalRevenue: totalRevenue,
      grossMargin: grossMargin,
      avarageTicket: avarageTicket,
      conversionRate: conversionRate,
      netRevenue: netRevenue,
      netProfit: netProfit,
      roi: roi,
      percentageRoi: percentageRoi,
    };
  }
}
