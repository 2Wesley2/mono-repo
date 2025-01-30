export default class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  async createProduct(data) {
    return await this.model.createProduct(data);
  }

  async bulkCreate(productList) {
    return await this.model.bulkCreate(productList);
  }

  async getProductsCategories(ownerId) {
    return await this.model.getProductsCategories(ownerId);
  }

  async searchProducts(ownerId, q) {
    return await this.model.searchProducts(ownerId, q);
  }

  async deleteProduct(id) {
    return await this.model.deleteProduct(id);
  }
}
