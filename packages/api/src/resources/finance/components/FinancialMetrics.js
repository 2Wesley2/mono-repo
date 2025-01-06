import FinancialMetricsInterface from '../interfaces/FinancialMetricsInterface.js';

export default class FinancialMetrics extends FinancialMetricsInterface {
  constructor(mathOperations) {
    super();
    this.mathOperations = mathOperations;
  }

  calculateTotalRevenue(salesValues) {
    return this.mathOperations.sumAllNumbersArray(salesValues);
  }

  calculateGrossMargin(totalRevenue, productsCostPrice) {
    return this.mathOperations.subtractOperation(totalRevenue, productsCostPrice);
  }

  averageTicket(totalRevenue, totalSales) {
    return this.mathOperations.divisionOperation(totalRevenue, totalSales);
  }

  calculateConversionRate(quantityVisitors, totalSales) {
    return this.mathOperations.calculatePercentage(quantityVisitors, totalSales);
  }

  calculateNetRevenue(totalRevenue, totalCosts) {
    return this.mathOperations.subtractOperation(totalRevenue, totalCosts);
  }

  calculateNetProfit(netRevenue, totalExpenses) {
    return this.mathOperations.subtractOperation(netRevenue, totalExpenses);
  }

  calculateROI(netProfit, investment) {
    return this.mathOperations.divisionOperation(netProfit, investment);
  }

  calculatePercentageROI(netProfit, investment) {
    return this.mathOperations.calculatePercentage(netProfit, investment);
  }
}
