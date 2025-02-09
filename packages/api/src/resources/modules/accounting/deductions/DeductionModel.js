import Model from '../../../../core/infrastructure/components/base/Model.js';
import { DEDUCTION, RETURN, TAXE, ALLOWANCE, DISCOUNT } from '../../../collections/index.js';

const refTypes = {
  TAXES: TAXE,
  RETURN: RETURN,
  DISCOUNT: DISCOUNT,
  ALLOWANCE: ALLOWANCE
};

const deductionSchema = {
  deductions: [
    {
      type: Model.objectIdType,
      required: true,
      ref: function () {
        return refTypes[this.type] || null;
      }
    }
  ]
};

export default class DeductionModel extends Model {
  constructor() {
    super(deductionSchema, DEDUCTION);
  }
}
