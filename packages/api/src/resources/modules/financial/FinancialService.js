import math from '../../entities/domain/financial/index.js';

export default class FinancialService {
  constructor({ repository, salesService, deductionsService }) {
    this.repository = repository;
    this.salesService = salesService;
    this.deductionsService = deductionsService;
  }

  async actualIncomeStatement(initDate, endDate) {
    const getGrossRevenue = await this.salesService.computeGrossRevenueByPeriod(initDate, endDate);
    const getDeductions = await this.deductionsService.computeDeductionsByPeriod(initDate, endDate);
    const netRevenue = math.sub([getGrossRevenue], [getDeductions]);
  }
}
