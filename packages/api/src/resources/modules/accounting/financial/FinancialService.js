import usecase from '../../../../core/use_cases/financial/GenerateFinancialReport.js';

export default class FinancialService {
  constructor({ repository, sale, deduction, expense, purchase, product, investment }) {
    this.services = {
      repository,
      sale,
      investment,
      expense,
      deduction,
      purchase,
      product
    };
  }

  async financialReport(startDate, endDate) {
    const timeFrame = { startDate, endDate };
    const financialMetrics = await usecase.reportFinancialMetrics(startDate, endDate, this.services);
    const saveReport = await this.repository.consolidateReport(financialMetrics, timeFrame);
    return saveReport;
  }
}
