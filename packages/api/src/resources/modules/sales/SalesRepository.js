import Repository from '../../core/Repository.js';
import { SALES } from '../../constants/index.js';

class SalesRepository extends Repository {
  constructor(model) {
    super(model, SALES);
  }
}

export default SalesRepository;
