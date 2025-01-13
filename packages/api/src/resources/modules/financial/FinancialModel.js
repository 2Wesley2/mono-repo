import Model from '../../components/Model.js';
import { FINANCIAL } from '../../collections/index.js';

import loaders from '../../../loaders/index.js';
const financialSchema = {};

export default class FinancialModel extends Model {
  constructor() {
    super(financialSchema, FINANCIAL);
  }
}
