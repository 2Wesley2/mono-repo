import Controller from '../../../../core/infrastructure/components/base/Controller.js';

export default class FinancialController extends Controller {
  constructor(service) {
    super();
    this.service = service;
  }

  initializeRoutes() {
    this.router.post('report', this.genereteReport.bind(this));
  }

  async genereteReport(req, res, next) {
    try {
      const { startDate, endDate } = req.body.date;
      const report = await this.service.financialReport(startDate, endDate);
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }
}
