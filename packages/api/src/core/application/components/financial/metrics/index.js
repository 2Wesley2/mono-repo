import FinancialMetrics from './interface/FinancialMetrics.js';

export default {
  revenues: {
    calculateTotalRevenue: (...args) => FinancialMetrics.calculateTotalRevenue(...args),
    calculateGrossRevenue: (...args) => FinancialMetrics.calculateGrossRevenue(...args),
    calculateNetRevenue: (...args) => FinancialMetrics.calculateNetRevenue(...args),
    calculateTotalGrossRevenue: (...args) => FinancialMetrics.calculateTotalGrossRevenue(...args),
    calculateOperationalGrossRevenue: (...args) => FinancialMetrics.calculateOperationalGrossRevenue(...args),
    calculateOperationalNetRevenue: (...args) => FinancialMetrics.calculateOperationalNetRevenue(...args),
  },
  costsAndExpenses: {
    calculateCMV: (...args) => FinancialMetrics.calculateCMV(...args),
    calculateOperationalExpenses: (...args) => FinancialMetrics.calculateOperationalExpenses(...args),
    calculateDeductions: (...args) => FinancialMetrics.calculateDeductions(...args),
  },
  profits: {
    calculateGrossProfit: (...args) => FinancialMetrics.calculateGrossProfit(...args),
    calculateNetProfit: (...args) => FinancialMetrics.calculateNetProfit(...args),
    calculatePreTaxProfit: (...args) => FinancialMetrics.calculatePreTaxProfit(...args),
    calculateNetIncome: (...args) => FinancialMetrics.calculateNetIncome(...args),
    calculateFinalNetIncome: (...args) => FinancialMetrics.calculateFinalNetIncome(...args),
  },
  marginsAndPerformance: {
    calculateGrossMargin: (...args) => FinancialMetrics.calculateGrossMargin(...args),
    calculateAverageTicket: (...args) => FinancialMetrics.calculateAverageTicket(...args),
    calculateConversionRate: (...args) => FinancialMetrics.calculateConversionRate(...args),
    calculateROI: (...args) => FinancialMetrics.calculateROI(...args),
    calculatePercentageROI: (...args) => FinancialMetrics.calculatePercentageROI(...args),
  },
  operationalAndNonOperationalResults: {
    calculateOperationalResult: (...args) => FinancialMetrics.calculateOperationalResult(...args),
    calculateNonOperationalResult: (...args) => FinancialMetrics.calculateNonOperationalResult(...args),
    calculateBeforeTaxProfit: (...args) => FinancialMetrics.calculateBeforeTaxProfit(...args),
  },
  taxesAndProvisions: {
    calculateTaxProvisions: (...args) => FinancialMetrics.calculateTaxProvisions(...args),
    calculateParticipations: (...args) => FinancialMetrics.calculateParticipations(...args),
  },
};
