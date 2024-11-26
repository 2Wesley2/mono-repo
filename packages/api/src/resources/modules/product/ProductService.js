import debug from '../../../debug/index.js';

class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async createProduct(productData) {
    try {
      const result = await this.repository.createProduct(productData);
      debug.logger.info('Service: Product created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Service: Error creating product', { error });
      throw error;
    }
  }

  async bulkCreate(productList) {
    try {
      const result = await this.repository.bulkCreate(productList);
      debug.logger.info('Service: Products created in bulk successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Service: Error creating products in bulk', { error });
      throw error;
    }
  }
  async findByIdInService(productId) {
    const product = await this.repository.findByIdInRepository(productId);
    return product;
  }

  async findByCategory(category) {
    const products = await this.repository.findByCategory(category);
    return products;
  }
  async getProductsByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid or empty IDs array.');
    }

    try {
      const products = await this.repository.getProductsByIds();
      debug.logger.info('Fetched products by IDs successfully', { ids, count: products.length });
      return products;
    } catch (error) {
      debug.logger.error('Error fetching products by IDs', { error: error.message, ids });
      throw error;
    }
  }
  async updateProduct(productId, productData) {
    try {
      const updatedProduct = await this.repository.updateProduct(productId, productData);
      debug.logger.info('Service: Product updated', { productId, data: updatedProduct });
      return updatedProduct;
    } catch (error) {
      debug.logger.error('Service: Error updating product', { productId, error });
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const deleted = await this.repository.deleteProduct(productId);
      debug.logger.info('Service: Product deleted', { productId });
      return deleted;
    } catch (error) {
      debug.logger.error('Service: Error deleting product', { productId, error });
      throw error;
    }
  }

  async updateStock(productId, quantityToAdjust) {
    try {
      const product = await this.repository.findByIdInRepository(productId);

      if (!product) {
        throw new Error(`Product with ID ${productId} does not exist.`);
      }

      if (product.type === 'ready_to_sell') {
        const newQuantity = product.quantity + quantityToAdjust;

        if (newQuantity < 0) {
          throw new Error(
            `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Required: ${-quantityToAdjust}.`,
          );
        }
        await this.repository.updateProduct(productId, { quantity: newQuantity });
      }
    } catch (error) {
      debug.logger.error('ProductService: Error updating stock', { productId, error });
      throw error;
    }
  }
}

export default ProductService;
