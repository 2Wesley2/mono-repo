import { Services } from "#services";
import type { SProduct } from "#schema";
import type { IProductModel, IProductService } from "#contract-product";
export default class ProductService
  extends Services
  implements IProductService
{
  constructor(protected model: IProductModel) {
    super();
  }

  public async setNewProduct(product: SProduct): Promise<any> {
    return await this.model.setNewProduct(product);
  }
}
