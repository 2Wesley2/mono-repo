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

  async bulkCreate(data) {
    debug.logger.info('OrderService.bulkCreate: Creating bulk orders', { data });
    return await this.repository.bulkCreate(data);
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
    debug.logger.debug(
      `Serviço: updateOrderContent chamado com orderNumber: ${orderNumber} e updateFields: ${JSON.stringify(updateFields)}`,
    );
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order) {
      debug.logger.error(`Serviço: Ordem com número ${orderNumber} não encontrada`);
      throw new AppError(`Ordem com número ${orderNumber} não encontrada`, 404);
    }

    updateOrderStatus(order);
    debug.logger.debug(`Serviço: Status da ordem atualizado para: ${order.status}`);

    const existingProductsMap = this._mapExistingProducts(order.products);
    debug.logger.debug(`Serviço: Produtos existentes mapeados: ${JSON.stringify([...existingProductsMap])}`);

    const uniqueUpdates = this._aggregateUpdates(updateFields);
    debug.logger.debug(`Serviço: Atualizações agregadas: ${JSON.stringify([...uniqueUpdates])}`);

    const updatedProducts = this._updateProductQuantities(uniqueUpdates, existingProductsMap);
    debug.logger.debug(`Serviço: Produtos atualizados: ${JSON.stringify(updatedProducts)}`);

    const totalAmount = await this._calculateTotalAmount(updatedProducts);
    debug.logger.debug(`Serviço: Valor total calculado: ${totalAmount}`);

    await this.repository.updateByOrderNumber(orderNumber, {
      products: Array.from(existingProductsMap.values()),
      totalAmount,
      status: order.status,
    });

    debug.logger.info(`Serviço: Ordem ${orderNumber} atualizada com sucesso`);
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
   * Atualiza as quantidades dos produtos existentes na ordem ou adiciona novos produtos.
   * @param {Map} uniqueUpdates - Atualizações agregadas.
   * @param {Map} existingProductsMap - Mapa de produtos existentes na ordem.
   * @returns {Array} Lista de produtos atualizados.
   */
  _updateProductQuantities(uniqueUpdates, existingProductsMap) {
    const updatedProducts = [];

    for (const { product, quantity } of uniqueUpdates.values()) {
      if (!existingProductsMap.has(product)) {
        if (quantity < 0) {
          throw new AppError(`Cannot decrement quantity for non-existent product ${product}`, 400);
        }
        existingProductsMap.set(product, { product, quantity });
      } else {
        const currentProduct = existingProductsMap.get(product);
        currentProduct.quantity += quantity;
        if (currentProduct.quantity < 0) {
          throw new AppError(`Invalid update: Quantity for product ${product} cannot be negative.`, 400);
        }
      }
      updatedProducts.push(existingProductsMap.get(product));
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
    debug.logger.debug(`Calculando total: Buscando produtos com IDs: ${JSON.stringify(productIds)}`);

    const productsInfo = await this.productService.getProductsByIds(productIds);
    debug.logger.debug(`Produtos retornados pelo serviço: ${JSON.stringify(productsInfo)}`);

    return updatedProducts.reduce((total, updatedProduct) => {
      const productInfo = productsInfo.find((p) => p._id.toString() === updatedProduct.product.toString());
      if (!productInfo) {
        debug.logger.error(`Produto com ID ${updatedProduct.product} não encontrado no serviço`);
        throw new AppError(`Produto com ID ${updatedProduct.product} não encontrado`, 400);
      }
      return total + updatedProduct.quantity * productInfo.price;
    }, 0);
  }
}

export default OrderService;
