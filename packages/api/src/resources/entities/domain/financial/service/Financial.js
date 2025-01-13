import financial from '../components/index.js';

export default class Financial {
  constructor({ sales, purchases, investments, expenses }) {
    this.sales = sales;
    this.purchases = purchases;
    this.investments = investments;
    this.expenses = expenses;
  }

  async reportGrossRevenue(startDate, endDate) {
    const getSales = await this.sales.aggregateSalesByPeriod(startDate, endDate);
    const grossRevenue = financial.metrics.calculateGrossRevenue(getSales);
    return grossRevenue;
  }

  financialMetricsSummary(data) {
    return { data };
  }
}
// CHECKPOINT
// trazer as abstrações da classe FinancialMetrics e utiliza-las na classe Financial para gerar reports
