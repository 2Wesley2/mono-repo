export default class Business {
  constructor({ financialMetrics, salesService, productService }) {
    this.financialMetrics = financialMetrics;
    this.salesService = salesService;
    this.productService = productService;
  }

  async fetchSalesAmountByDateRange({ startDate, endDate }) {
    const amount = await this.salesService.getSalesAmountByDateRage({ startDate, endDate });
    return amount;
  }

  async financialMetricsSummary({ startDate, endDate }) {
    const amount = await this.fetchSalesAmountByDateRange({ startDate, endDate });
    const totalRevenue = this.financialMetrics.calculateTotalRevenue(amount);
    const grossMargin = this.financialMetrics.calculateGrossMargin(totalRevenue);
  }
}
