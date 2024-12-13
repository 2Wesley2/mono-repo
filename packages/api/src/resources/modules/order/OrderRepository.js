/**
 * Classe responsável por interagir com o modelo de comanda (OrderModel).
 * Centraliza a lógica de repositório e facilita o gerenciamento de dados de comanda.
 * @class OrderRepository
 */
class OrderRepository {
  /**
   * Inicializa uma nova instância do repositório de comanda.
   * @param {Object} orderModel - Modelo de dados utilizado para acessar e manipular as comanda no banco de dados.
   */
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  /**
   * Cria uma nova comanda no banco de dados.
   * @param {Object} data - Dados da comanda a ser criado.
   * @returns {Promise<Object>} Retorna a comanda recém-criada.
   * @example
   * const order = await orderRepository.createOrder({ totalAmount: 100, products: [...] });
   * console.log(order);
   */
  async createOrder(data) {
    return await this.orderModel.createOrder(data);
  }

  /**
   * Cria múltiplas comanda no banco de dados em uma única operação.
   * @param {Object[]} data - Lista de dados das comanda a serem criados.
   * @returns {Promise<Object[]>} Retorna a lista de comanda recém-criados.
   * @example
   * const orders = await orderRepository.bulkCreate([{ ...order1 }, { ...order2 }]);
   * console.log(orders);
   */
  async bulkCreate(data) {
    return await this.orderModel.bulkCreate(data);
  }

  /**
   * Atualiza os produtos associados a uma comanda existente no banco de dados.
   * @param {Object} currentOrder - Pedido atual que será atualizado.
   * @param {Object[]} updateOrderProductsFields - Dados dos produtos para atualização.
   * @property {string} updateOrderProductsFields[].product - ID do produto.
   * @property {number} updateOrderProductsFields[].quantity - Quantidade do produto.
   * @param {Object[]} getExistingProducts - Lista de produtos existentes no banco de dados.
   * @returns {Promise<Object>} Retorna a comanda atualizada.
   * @example
   * const updatedOrder = await orderRepository.updateOrderProducts(currentOrder, updateFields, existingProducts);
   * console.log(updatedOrder);
   */
  async updateOrderProducts(currentOrder, updateOrderProductsFields, getExistingProducts) {
    const currentOrderId = currentOrder._id;

    // Atualiza produtos existentes na comanda
    const updatedProducts = currentOrder.products.reduce((acc, product) => {
      const updatedProduct = updateOrderProductsFields.find(
        (uProd) => String(uProd.product) === String(product.product),
      );

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

    // Adiciona novos produtos a comanda
    const newProducts = updateOrderProductsFields
      .filter(
        (newProd) =>
          !currentOrder.products.some((existingProd) => String(existingProd.product) === String(newProd.product)) &&
          newProd.quantity > 0,
      )
      .map((newProd) => ({
        product: newProd.product,
        quantity: newProd.quantity,
      }));
    const finalProducts = [...updatedProducts, ...newProducts];
    const currentOrderTotalAmount = currentOrder.totalAmount;
    const currentOrderProducts = currentOrder.products;
    console.log(JSON.stringify(`currentOrderTotalAmount: ${currentOrderTotalAmount}`));

    return await this.orderModel.updateOrderProducts(
      finalProducts,
      currentOrderId,
      getExistingProducts,
      currentOrderTotalAmount,
      currentOrderProducts,
    );
  }

  /**
   * Busca uma comanda pelo número do comanda.
   * @param {number} orderNumber - Número da comanda a ser buscado.
   * @returns {Promise<Object|null>} Retorna a comanda encontrada ou `null` se não encontrado.
   * @example
   * const order = await orderRepository.findByOrderNumber(123);
   * console.log(order);
   */
  async findByOrderNumber(orderNumber) {
    const result = await this.orderModel.findByOrderNumber(orderNumber);
    return result;
  }

  /**
   * Lista os produtos associados a uma comanda específico.
   * @param {number} orderNumber - Número da comanda a ser buscada.
   * @returns {Promise<Object>} Retorna os produtos associados a comanda.
   * @example
   * const products = await orderRepository.listProductsByOrder(123);
   * console.log(products);
   */
  async listProductsByOrder(orderNumber) {
    const products = await this.orderModel.listProductsByOrder(orderNumber);
    return products;
  }
}

export default OrderRepository;
