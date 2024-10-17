import Controller from '../../core/Controller.js';
import { SALES } from '../../constants/index.js';

class SalesController extends Controller {
  constructor(salesService) {
    super(salesService, SALES);
  }
}

export default SalesController;
