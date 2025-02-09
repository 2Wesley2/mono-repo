import Model from '#core/infrastructure/components/base/Model.js';
import { BUSINESS } from '#resources/collections/index.js';
import loaders from '#core/loaders/index.js';

const stockSchema = {
  businessID: { type: Model.objectIdType, ref: BUSINESS, required: true }
};

export default class StockModel extends Model {
  constructor() {
    super(stockSchema, STOCK);
  }
}
