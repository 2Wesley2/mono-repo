import Model from '../../../../core/infrastructure/database/components/base/Model.js';
import { DISCOUNT } from '../../../collections/index.js';

const discountsType = ['commercialDiscount', 'conditionalDiscount'];

const discountSchema = {
  discounts: [
    {
      type: Model.objectIdType,
      required: true,
      enum: [...discountsType],
    },
  ],
};

export default class DiscountModel extends Model {
  constructor() {
    super(discountSchema, DISCOUNT);
  }
}
