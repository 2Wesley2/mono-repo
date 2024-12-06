import debug from '../../../debug/index.js';
import Database from '../../../database/index.js';

class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  async createProduct(data) {
    try {
      const result = await this.model.createProduct(data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async bulkCreate(productList) {
    try {
      const result = await this.model.bulkCreate(productList);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByIds(ids) {
    return await this.model.getProductsByIds(ids);
  }

  async searchProducts(q) {
    const product = await this.model.searchProducts(q);
    return product;
  }

  async findByIdProducts(id) {
    const product = await this.model.findByIdsProducts(ids);
    return product;
  }

  async findByCategory(category) {
    const products = await this.model.findByCategory(category);
    return products;
  }

  async updateProduct(id, data) {
    try {
      const updatedProduct = await this.model.updateProduct(id, data);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await this.model.deleteProduct(id);
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductRepository;
