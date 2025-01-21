export default class FinancialService {
  constructor(repository, usecases) {
    this.repository = repository;
    this.usecases = usecases;
  }

  async financialReport(startDate, endDate) {
    const report = await this.usecases.reportFinancialMetrics(startDate, endDate);
    const timeFrame = { startDate, endDate };
    const saveReport = await this.repository.consolidateReport(report, timeFrame);
    return saveReport;
  }
}
