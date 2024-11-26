import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';
import { shouldUpdateStock, updateOrderStatus } from '../../../utils/order/index.js';
class OrderService {
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }

  async createOrder(orderData) {
    debug.logger.info('OrderService.createOrder: Creating order', { orderData });
    return await this.repository.createOrder(orderData);
  }

  async bulkCreate(orderList) {
    debug.logger.info('OrderService.bulkCreate: Creating bulk orders', { orderList });
    return await this.repository.bulkCreate(orderList);
  }

  async updateOrderContent(orderNumber, updateFields) {
    return await this.model.updateByOrderNumber(orderNumber, updateFields);
  }

  async listProductsByOrderService(orderNumber) {
    return await this.repository.listProductsByOrderRepository(orderNumber);
  }

  /**
   * Atualiza as quantidades de produtos em uma ordem.
   * @param {number} orderNumber - Número da ordem.
   * @param {Object[]} updateFields - Lista de produtos a serem atualizados no formato { product, quantity }.
   * @throws {Error} Lança erro se a ordem ou algum produto não for encontrado.
   */
  async updateOrderContent(orderNumber, updateFields) {
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new AppError(`Ordem com número ${orderNumber} não encontrada`, 404);
    }

    updateOrderStatus(order);
    const existingProductsMap = this._mapExistingProducts(order.products);
    const uniqueUpdates = this._aggregateUpdates(updateFields);

    const updatedProducts = this._updateProductQuantities(uniqueUpdates, existingProductsMap);
    const totalAmount = this._calculateTotalAmount(updatedProducts);

    await this.repository.updateByOrderNumber(orderNumber, {
      products: Array.from(existingProductsMap.values()),
      totalAmount,
      status: order.status,
    });

    return {
      success: true,
      message: 'Ordem atualizada com sucesso',
      updatedProducts,
      totalAmount,
    };
  }

  /**
   * Cria um mapa de produtos existentes para consulta rápida.
   * @param {Array} products - Produtos existentes na ordem.
   * @returns {Map} Um mapa de ID do produto para dados do produto.
   */
  _mapExistingProducts(products) {
    return new Map(products.map((p) => [p.product.toString(), p]));
  }

  /**
   * Agrega as atualizações somando quantidades para entradas duplicadas de produtos.
   * @param {Array} updateFields - Lista de atualizações no formato { product, quantity }.
   * @returns {Map} Um mapa de ID do produto para dados de atualização agregados.
   */
  _aggregateUpdates(updateFields) {
    const uniqueUpdates = new Map();
    for (const { product, quantity } of updateFields) {
      if (!uniqueUpdates.has(product)) {
        uniqueUpdates.set(product, { product, quantity });
      } else {
        uniqueUpdates.get(product).quantity += quantity;
      }
    }
    return uniqueUpdates;
  }

  /**
   * Atualiza as quantidades dos produtos existentes na ordem.
   * @param {Map} uniqueUpdates - Atualizações agregadas.
   * @param {Map} existingProductsMap - Mapa de produtos existentes na ordem.
   * @returns {Array} Lista de produtos atualizados.
   * @throws {AppError} Se um produto não for encontrado na ordem.
   */
  _updateProductQuantities(uniqueUpdates, existingProductsMap) {
    const updatedProducts = [];
    for (const { product, quantity } of uniqueUpdates.values()) {
      if (!existingProductsMap.has(product)) {
        throw new AppError(`Produto com ID ${product} não encontrado na ordem`, 400);
      }
      const currentProduct = existingProductsMap.get(product);
      currentProduct.quantity = quantity;
      updatedProducts.push(currentProduct);
    }
    return updatedProducts;
  }

  /**
   * Calcula o valor total com base nos produtos atualizados.
   * @param {Array} updatedProducts - Lista de produtos atualizados.
   * @returns {number} Valor total.
   * @throws {AppError} Se um produto não for encontrado no serviço de produtos.
   */
  async _calculateTotalAmount(updatedProducts) {
    const productIds = updatedProducts.map((p) => p.product);
    const productsInfo = await this.productService.getProductsByIds(productIds);

    return updatedProducts.reduce((total, updatedProduct) => {
      const productInfo = productsInfo.find((p) => p._id.toString() === updatedProduct.product.toString());
      if (!productInfo) {
        throw new AppError(`Produto com ID ${updatedProduct.product} não encontrado`, 400);
      }
      return total + updatedProduct.quantity * productInfo.price;
    }, 0);
  }
}

export default OrderService;
