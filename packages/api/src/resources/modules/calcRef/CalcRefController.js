import Controller from '../../core/Controller.js';

class CalcRefController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }
  initializeCustomRoutes() {
    this.router.get('/minimum', this.getMinimumRedeemAmount.bind(this));
    this.router.get('/base', this.getBaseValue.bind(this));
  }

  async getBaseValue() {
    const baseValue = await this.service.getBaseValue();
    return baseValue;
  }

  async getMinimumRedeemAmount() {
    const minimumRedeemAmount = await this.service.getMinimumRedeemAmount();
    return minimumRedeemAmount;
  }
}
export default CalcRefController;
