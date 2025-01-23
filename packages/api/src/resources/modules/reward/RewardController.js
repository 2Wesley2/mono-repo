import Controller from '../../../core/infrastructure/components/base/Controller.js';

class RewardController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {}
}

export default RewardController;
