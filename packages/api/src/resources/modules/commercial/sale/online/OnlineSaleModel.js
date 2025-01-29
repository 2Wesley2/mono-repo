import SaleModel from '../model/SaleModel.js';
import { ONLINE_SALE } from '#src/resources/collections/index.js';

const onlineSaleSchema = {
  paymentMethod: { type: String, required: true },
  deliveryAddress: { type: String },
  trackingCode: { type: String },
};
export class OnlineSaleModel extends SaleModel {
  constructor(schema = {}, modelName = ONLINE_SALE, options = {}, middlewares = []) {
    const combinedSchema = { ...onlineSaleSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }
}
