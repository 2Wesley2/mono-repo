import debug from '../../../../debug/index.js';
import Database from '../../../../database/index.js';

/**
 * Repositório para manipulação de produtos no banco de dados.
 *
 * @class ProductRepository
 */

class ProductRepository {
  /**
   * Cria uma instância de ProductRepository.
   *
   * @param {ProductModel} model - Modelo de dados para operações do repositório.
   */
  constructor(model) {
    this.model = model;
  }

  async createProduct(data) {
    return await this.model.createProduct(data);
  }

  async bulkCreate(productList) {
    return await this.model.bulkCreate(productList);
  }

  async getProductsByIds(ids) {
    return await this.model.getProductsByIds(ids);
  }

  async searchProducts(q) {
    return await this.model.searchProducts(q);
  }

  async findByCategory(category) {
    return await this.model.findByCategory(category);
  }

  async updateProduct(id, data) {
    return await this.model.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return await this.model.deleteProduct(id);
  }
}

export default ProductRepository;
