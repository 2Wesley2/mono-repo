import type { SProduct } from "#schema";

export interface IProductModel<T extends SProduct = SProduct> {
  setNewProduct: (data: T) => Promise<any>;
}
