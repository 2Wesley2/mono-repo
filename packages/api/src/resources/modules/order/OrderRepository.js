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
   * Atualiza os produtos de uma comanda e o valor total associado.
   * @param {string} orderId - ID único da comanda.
   * @param {Object[]} finalProducts - Lista de produtos atualizados associados à comanda.
   * @param {number} totalAmount - Novo valor total da comanda.
   * @returns {Promise<Object>} Retorna a comanda atualizada.
   * @example
   * const updatedOrder = await orderRepository.updateOrderProducts('orderId123', [{ product: 'productId1', quantity: 3 }], 200);
   * console.log(updatedOrder);
   */
  async updateOrderProducts(orderId, finalProducts, totalAmount) {
    return await this.orderModel.updateOrderProducts(orderId, finalProducts, totalAmount);
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
