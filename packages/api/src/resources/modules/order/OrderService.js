import AppError from '../../../errors/AppError.js';
import { extractedProductIds, productsExistById } from '../../../utils/order/index.js';

class OrderService {
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }
  async updateOrderProducts(orderNumber, updateOrderProductsFields) {
    const productsIds = extractedProductIds(updateOrderProductsFields);
    const getExistingProducts = await this.productService.getProductsByIds(productsIds);
    const productsExist = productsExistById(productsIds, getExistingProducts);
    if (!productsExist) {
      throw new AppError('Produtos inexistentes encontrados na solicitação', 400);
    }
    const currentOrder = await this.repository.findByOrderNumber(orderNumber);
    return await this.repository.updateOrderProducts(currentOrder, updateOrderProductsFields, getExistingProducts);
  }

  async listProductsByOrder(orderNumber) {
    const products = await this.repository.listProductsByOrder(orderNumber);
    const productsIds = extractedProductIds(products.products);
    const getExistingProducts = await this.productService.getProductsByIds(productsIds);
    const completeInfoByProducts = products.products.map((product) => {
      const existingProduct = getExistingProducts.find((p) => p._id.toString() === product.product.toString());

      return {
        _id: existingProduct?._id || null,
        ...product,
        product: existingProduct?.name || null,
        price: existingProduct?.price || null,
      };
    });
    const result = {
      ...products,
      products: completeInfoByProducts,
    };
    return result;
  }
}

export default OrderService;
