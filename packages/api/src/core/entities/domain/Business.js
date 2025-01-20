export default class Business {
  constructor({ financial }) {
    this.financial = financial;
  }

  financialMetricsSummary(sales) {
    return this.financial.financialMetricsSummary(sales);
  }
}
