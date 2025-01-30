export default class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async createProduct(productData) {
    return await this.repository.createProduct(productData);
  }

  async bulkCreate(productList) {
    return await this.repository.bulkCreate(productList);
  }

  async getProductsCategories(ownerId) {
    return await this.repository.getProductsCategories(ownerId);
  }

  async searchProducts(ownerId, q) {
    return await this.repository.searchProducts(ownerId, q);
  }

  async deleteProduct(productId) {
    return await this.repository.deleteProduct(productId);
  }
}
