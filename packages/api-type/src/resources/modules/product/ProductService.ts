import { Services } from "#services";
import type { SProduct } from "#schema";
import type { IProductModel } from "./contract/index";
export default class ProductService extends Services {
  constructor(protected model: IProductModel) {
    super();
  }

  public async setNewProduct(product: SProduct) {
    return await this.model.setNewProduct(product);
  }
}
