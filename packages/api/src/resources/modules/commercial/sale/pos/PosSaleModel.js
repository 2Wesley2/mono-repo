import SaleModel from '../model/SaleModel.js';
import { POS_SALE } from '#src/resources/collections/index.js';

export default class PosSaleModel extends SaleModel {
  constructor(schema = {}, modelName = POS_SALE, options = {}, middlewares = []) {
    const combinedSchema = { ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }
}
