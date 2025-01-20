import Model from '../../../../core/entities/system/base/Model.js';
import { DISCOUNT } from '../../../collections/index.js';

const discountsType = ['commercialDiscount', 'conditionalDiscount'];

const discountSchema = {
  discounts: [
    {
      type: Model.objectId,
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
