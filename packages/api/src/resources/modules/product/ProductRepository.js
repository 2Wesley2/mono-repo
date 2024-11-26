import debug from '../../../debug/index.js';
import Database from '../../../database/index.js';

class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  async createProduct(data) {
    try {
      const result = await this.model.createProduct(data);
      debug.logger.info('Repository: Product created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Repository: Error creating product', { error });
      throw error;
    }
  }

  async bulkCreate(productList) {
    try {
      const result = await this.model.bulkCreate(productList);
      debug.logger.info('Repository: Products created in bulk successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Repository: Error creating products in bulk', { error });
      throw error;
    }
  }
  async findByIdInRepository(id) {
    const product = await this.model.findByIdInModel(id);
    return product;
  }

  async findByCategory(category) {
    const products = await this.model.findByCategory(category);
    return products;
  }

  async getProductsByIds(ids) {
    return await this.model.getProductsByIds(ids);
  }

  async updateProduct(id, data) {
    try {
      const updatedProduct = await this.model.updateProduct(id, data);
      debug.logger.info('Repository: Product updated', { id, data: updatedProduct });
      return updatedProduct;
    } catch (error) {
      debug.logger.error('Repository: Error updating product', { id, error });
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await this.model.deleteProduct(id);
      debug.logger.info('Repository: Product deleted', { id });
      return deleted;
    } catch (error) {
      debug.logger.error('Repository: Error deleting product', { id, error });
      throw error;
    }
  }
}

export default ProductRepository;
