import debug from '../../../../debug/index.js';

/**
 * Serviço para lógica de negócios de produtos.
 *
 * @class ProductService
 */
class ProductService {
  /**
   * Cria uma instância de ProductService.
   *
   * @param {ProductRepository} repository - Repositório para manipulação de produtos.
   */
  constructor(repository) {
    this.repository = repository;
  }

  async createProduct(productData) {
    return await this.repository.createProduct(productData);
  }

  async bulkCreate(productList) {
    return await this.repository.bulkCreate(productList);
  }

  async findByCategory(category) {
    return await this.repository.findByCategory(category);
  }

  async getProductsByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return 'Invalid or empty IDs array.';
    }
    return await this.repository.getProductsByIds(ids);
  }

  async searchProducts(q) {
    return await this.repository.searchProducts(q);
  }
  async updateProduct(productId, productData) {
    return await this.repository.updateProduct(productId, productData);
  }

  async deleteProduct(productId) {
    return await this.repository.deleteProduct(productId);
  }

  async updateStock(productId, quantityToAdjust) {
    try {
      const product = await this.getProductsByIds([productId]);

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
        return await this.repository.updateProduct(productId, { quantity: newQuantity });
      }
    } catch (error) {
      debug.logger.error('ProductService: Error updating stock', { productId, error });
      throw error;
    }
  }
}

export default ProductService;
