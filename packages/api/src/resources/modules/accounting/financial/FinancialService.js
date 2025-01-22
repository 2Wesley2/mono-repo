import usecase from '../../../../core/use_cases/financial/GenerateFinancialReport.js';

export default class FinancialService {
  constructor({ repository, sales, stockAudits, investments, expenses, deductions }) {
    this.services = {
      repository,
      sales,
      stockAudits,
      investments,
      expenses,
      deductions,
    };
  }

  async financialReport(startDate, endDate) {
    const timeFrame = { startDate, endDate };
    const financialMetrics = await usecase.reportFinancialMetrics(startDate, endDate, this.services);
    const saveReport = await this.repository.consolidateReport(financialMetrics, timeFrame);
    return saveReport;
  }
}
