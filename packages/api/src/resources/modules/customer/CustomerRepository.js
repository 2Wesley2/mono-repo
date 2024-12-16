/**
 * Repositório responsável por interagir com o modelo de clientes no banco de dados.
 *
 * @class CustomerRepository
 */
class CustomerRepository {
  constructor(model) {
    /**
     * Cria uma instância de CustomerRepository.
     *
     * @param {Object} model - Modelo usado para manipulação dos dados de clientes no banco.
     */
    this.model = model;
  }

  /**
   * Cria um novo cliente no banco de dados.
   *
   * @param {Object} customerData - Dados do cliente a ser criado.
   * @returns {Promise<Object>} O cliente criado.
   * @example
   * const newCustomer = await customerRepository.createCustomer({ name: 'John Doe', email: 'john@example.com' });
   */
  async createCustomer(customerData) {
    return await this.model.createCustomer(customerData);
  }

  /**
   * Busca um cliente pelo ID no banco de dados.
   *
   * @param {string} customerId - ID do cliente a ser buscado.
   * @returns {Promise<Object|null>} O cliente encontrado ou null se não existir.
   * @example
   * const customer = await customerRepository.getCustomerById('60d21b4667d0d8992e610c85');
   */
  async getCustomerById(customerId) {
    return await this.model.getCustomerById(customerId);
  }

  /**
   * Lista todos os clientes do banco de dados.
   *
   * @returns {Promise<Object[]>} Uma lista de todos os clientes.
   * @example
   * const customers = await customerRepository.listAllCustomers();
   */
  async listAllCustomers() {
    return await this.model.listAllCustomers();
  }

  /**
   * Atualiza as informações de um cliente no banco de dados.
   *
   * @param {string} id - ID do cliente a ser atualizado.
   * @param {Object} updateData - Dados para atualização do cliente.
   * @returns {Promise<Object|null>} O cliente atualizado ou null se não encontrado.
   * @example
   * const updatedCustomer = await customerRepository.updateCustomer('60d21b4667d0d8992e610c85', { name: 'Jane Doe' });
   */
  async updateCustomer(id, updateData) {
    return await this.model.updateCustomer(id, updateData);
  }

  /**
   * Deleta um cliente do banco de dados pelo ID.
   *
   * @param {string} id - ID do cliente a ser deletado.
   * @returns {Promise<Object|null>} O cliente deletado ou null se não encontrado.
   * @example
   * const deletedCustomer = await customerRepository.deleteCustomer('60d21b4667d0d8992e610c85');
   */
  async deleteCustomer(id) {
    return await this.model.deleteCustomer(id);
  }
}

export default CustomerRepository;
