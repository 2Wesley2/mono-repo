import debug from '../../../debug/index.js';

class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(productData) {
    try {
      const result = await this.repository.create(productData);
      debug.logger.info('Service: Product created successfully', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Service: Error creating product', { error });
      throw error;
    }
  }

  async findById(productId) {
    try {
      const product = await this.repository.findById(productId);
      debug.logger.info('Service: Product found', { productId });
      return product;
    } catch (error) {
      debug.logger.error('Service: Error finding product by ID', { productId, error });
      throw error;
    }
  }

  async update(productId, productData) {
    try {
      const updatedProduct = await this.repository.update(productId, productData);
      debug.logger.info('Service: Product updated', { productId, data: updatedProduct });
      return updatedProduct;
    } catch (error) {
      debug.logger.error('Service: Error updating product', { productId, error });
      throw error;
    }
  }

  async delete(productId) {
    try {
      const deleted = await this.repository.delete(productId);
      debug.logger.info('Service: Product deleted', { productId });
      return deleted;
    } catch (error) {
      debug.logger.error('Service: Error deleting product', { productId, error });
      throw error;
    }
  }

  async find(filter = {}) {
    try {
      const products = await this.repository.find(filter);
      debug.logger.info('Service: Products found', { filter });
      return products;
    } catch (error) {
      debug.logger.error('Service: Error finding products', { filter, error });
      throw error;
    }
  }

  async updateStock(productId, quantityToAdjust) {
    try {
      const product = await this.repository.findById(productId);

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
        await this.repository.update(productId, { quantity: newQuantity });
      }
    } catch (error) {
      debug.logger.error('ProductService: Error updating stock', { productId, error });
      throw error;
    }
  }
}

export default ProductService;
