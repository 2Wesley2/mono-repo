import Controller from '../../../resources/core/Controller.js';

class RewardController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {}
}

export default RewardController;