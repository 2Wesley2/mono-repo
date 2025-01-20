import Model from '../../../../core/entities/system/base/Model.js';
import { DEDUCTION, RETURN, TAXE, ALLOWANCE, DISCOUNT } from '../../../collections/index.js';

const refTypes = {
  TAXES: TAXE,
  RETURN: RETURN,
  DISCOUNT: DISCOUNT,
  ALLOWANCE: ALLOWANCE,
};

const deductionSchema = {
  deductions: [
    {
      type: Model.objectId,
      required: true,
      ref: function () {
        return refTypes[this.type] || null;
      },
    },
  ],
};

export default class DeductionModel extends Model {
  constructor() {
    super(deductionSchema, DEDUCTION);
  }
}
