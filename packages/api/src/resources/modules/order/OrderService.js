import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';
import { extractedProductIds, productsExistById } from '../../../utils/order/index.js';
class OrderService {
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }
  async updateOrderProducts(orderNumber, updateOrderProductsFields) {
    const productsIds = extractedProductIds(updateOrderProductsFields);
    const getExistingProducts = await this.getProductsByIds(productsIds);
    const productsExist = productsExistById(productsIds, getExistingProducts);
    if (!productsExist) {
      throw new AppError('Produtos inexistentes encontrados na solicitação', 400);
    }
    const currentOrder = await this.repository.findByOrderNumber(orderNumber);
    const resultOfUpdate = await this.repository.updateOrderProducts(currentOrder, updateOrderProductsFields);
  }

  async listProductsByOrder(orderNumber) {
    const products = await this.repository.listProductsByOrder(orderNumber);
    return products;
  }

  async getProductsByIds(ids) {
    const products = await this.productService.getProductsByIds(ids);
    return products;
  }
}

export default OrderService;
