import Model from '../../core/Model.js';
import { SALE } from '../../constants/index.js';

const saleSchema = {};

export default class SaleModel extends Model {
  constructor() {
    super(saleSchema, SALE);
  }

  async finalizeSale(saleData) {
    if (!saleData) {
      throw Error;
    }

    return await this.model.create(saleData);
  }
  async getAllSales() {}
  async getSaleById() {}
}
