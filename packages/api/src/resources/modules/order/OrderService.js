import AppError from '../../../errors/AppError.js';
import { extractedProductIds, productsExistById } from '../../../utils/order/index.js';

/**
 * @class OrderService
 * Serviço responsável por gerenciar as operações relacionadas a ordens, incluindo listagem e atualização de produtos.
 */
class OrderService {
  /**
   * Cria uma nova instância de `OrderService`.
   * @param {Object} repository - Repositório para manipulação de dados de ordens no banco de dados.
   * @param {Object} productService - Serviço para manipular dados de produtos associados às ordens.
   */
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }

  /**
   * Atualiza os produtos associados a uma ordem existente.
   * Valida os IDs dos produtos fornecidos, verifica se os produtos existem e atualiza os dados da ordem.
   *
   * @param {number} orderNumber - Número único identificador da ordem.
   * @param {Object[]} updateOrderProductsFields - Lista de objetos contendo as atualizações dos produtos (e.g., { product, quantity }).
   * @property {string} updateOrderProductsFields[].product - ID do produto a ser atualizado.
   * @property {number} updateOrderProductsFields[].quantity - Nova quantidade do produto.
   * @returns {Promise<Object>} Retorna os dados da ordem atualizados.
   * @throws {AppError} Lança erro se produtos inexistentes forem encontrados ou se a atualização falhar.
   * @example
   * const updatedOrder = await orderService.updateOrderProducts(123, [
   *   { product: 'productId1', quantity: 2 },
   *   { product: 'productId2', quantity: 5 },
   * ]);
   * console.log(updatedOrder);
   */
  async updateOrderProducts(orderNumber, updateOrderProductsFields) {
    const productsIds = extractedProductIds(updateOrderProductsFields);

    // Obtém os produtos existentes no banco de dados
    const getExistingProducts = await this.productService.getProductsByIds(productsIds);

    // Verifica se todos os produtos fornecidos existem
    const productsExist = productsExistById(productsIds, getExistingProducts);
    if (!productsExist) {
      throw new AppError('Produtos inexistentes encontrados na solicitação', 400);
    }

    // Obtém a ordem atual no banco de dados
    const currentOrder = await this.repository.findByOrderNumber(orderNumber);

    // Atualiza os produtos da ordem com base nos dados fornecidos
    return await this.repository.updateOrderProducts(currentOrder, updateOrderProductsFields, getExistingProducts);
  }

  /**
   * Lista os produtos associados a uma ordem, enriquecendo os dados com informações completas dos produtos.
   *
   * @param {number} orderNumber - Número único identificador da ordem.
   * @returns {Promise<Object>} Retorna os dados da ordem, incluindo informações detalhadas dos produtos.
   * @throws {AppError} Lança erro se a ordem não for encontrada ou se houver falha ao buscar produtos.
   * @example
   * const products = await orderService.listProductsByOrder(123);
   * console.log(products);
   *  {
   *    orderNumber: 123,
   *    products: [
   *      { _id: 'productId1', product: 'Produto A', quantity: 2, price: 100 },
   *      { _id: 'productId2', product: 'Produto B', quantity: 5, price: 200 }
   *    ]
   *  }
   */
  async listProductsByOrder(orderNumber) {
    // Obtém os produtos associados à ordem no banco de dados
    const products = await this.repository.listProductsByOrder(orderNumber);

    // Extrai os IDs dos produtos para busca detalhada
    const productsIds = extractedProductIds(products.products);

    // Obtém informações completas dos produtos existentes no banco
    const getExistingProducts = await this.productService.getProductsByIds(productsIds);

    // Enriquecendo informações dos produtos associados à ordem
    const completeInfoByProducts = products.products.map((product) => {
      const existingProduct = getExistingProducts.find((p) => p._id.toString() === product.product.toString());

      return {
        _id: existingProduct?._id || null,
        ...product,
        product: existingProduct?.name || null,
        price: existingProduct?.price || null,
      };
    });
    // Retorna os dados completos da ordem
    const result = {
      ...products,
      products: completeInfoByProducts,
    };
    return result;
  }
}

export default OrderService;
