import { NotFoundError, InvalidRequestError } from '../../../errors/Exceptions.js';
import { extractedProductIds, productsExistById, calculateTotalAmount } from '../../../utils/order/index.js';

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
   * @throws {InvalidRequestError|NotFoundError} Caso a validação ou atualização falhe.
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
    // Atualiza os produtos e calcula totalAmount
    const finalProducts = this.calculateUpdatedProducts(currentOrder.products, updateOrderProductsFields);
    const totalAmount = calculateTotalAmount(
      getExistingProducts, // Produtos existentes no sistema
      finalProducts, // Produtos atualizados na comanda
      currentOrder.totalAmount, // Valor total atual da comanda
      currentOrder.products, // Produtos associados à comanda atual
    );

    // Atualiza os produtos da ordem com base nos dados fornecidos
    return await this.repository.updateOrderProducts(currentOrder._id, finalProducts, totalAmount);
  }

  /**
   * Combina os produtos existentes e novos, removendo os de quantidade <= 0.
   * @param {Object[]} currentProducts - Produtos existentes na ordem.
   * @param {Object[]} updateFields - Dados para atualização dos produtos.
   * @returns {Object[]} Produtos combinados e atualizados.
   * @example
   * const updatedProducts = orderService.calculateUpdatedProducts(
   *   [{ product: 'productId1', quantity: 1 }],
   *   [{ product: 'productId1', quantity: 3 }, { product: 'productId2', quantity: 5 }]
   * );
   * console.log(updatedProducts);
   */

  calculateUpdatedProducts(currentProducts, updateFields) {
    const updatedProducts = currentProducts.reduce((acc, product) => {
      const updatedProduct = updateFields.find((uProd) => String(uProd.product) === String(product.product));

      if (updatedProduct) {
        if (updatedProduct.quantity <= 0) {
          return acc; // Remove produtos com quantidade <= 0
        }
        return [
          ...acc,
          {
            ...product,
            quantity: updatedProduct.quantity,
          },
        ];
      }
      return [...acc, product];
    }, []);

    const newProducts = updateFields
      .filter(
        (newProd) =>
          !currentProducts.some((existingProd) => String(existingProd.product) === String(newProd.product)) &&
          newProd.quantity > 0,
      )
      .map((newProd) => ({
        product: newProd.product,
        quantity: newProd.quantity,
      }));

    return [...updatedProducts, ...newProducts];
  }

  /**
   * Lista os produtos associados a uma ordem, enriquecendo os dados com informações completas dos produtos.
   *
   * @param {number} orderNumber - Número único identificador da ordem.
   * @returns {Promise<Object>} Retorna os dados da ordem, incluindo informações detalhadas dos produtos.
   * @throws {NotFoundError} Caso a ordem não seja encontrada ou se houver falha ao buscar produtos.
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
