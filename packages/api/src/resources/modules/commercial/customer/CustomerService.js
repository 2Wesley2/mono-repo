import debug from '../../../../debug/index.js';

/**
 * Serviço responsável por gerenciar operações relacionadas a clientes e recompensas.
 *
 * @class CustomerService
 */
class CustomerService {
  /**
   * Cria uma instância de CustomerService.
   *
   * @param {Object} repository - Repositório para manipulação de dados de clientes.
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Cria um novo cliente e inicializa suas recompensas.
   *
   * @param {Object} customerData - Dados do cliente a ser criado.
   * @returns {Promise<Object>} O cliente atualizado com referência à recompensa criada.
   * @throws {Error} Lança um erro caso ocorra falha na criação.
   * @example
   * const newCustomer = await customerService.createCustomer({ name: 'John Doe', email: 'john@example.com' });
   */
  async createCustomer(customerData) {
    try {
      const newCustomer = await this.repository.createCustomer(customerData);
      return newCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao criar Cliente', {
        customerData,
        error
      });
      throw error;
    }
  }

  /**
   * Atualiza as informações de um cliente.
   *
   * @param {string} id - ID do cliente a ser atualizado.
   * @param {Object} updateData - Dados para atualização do cliente.
   * @returns {Promise<Object>} O cliente atualizado.
   * @throws {Error} Lança um erro caso ocorra falha na atualização.
   * @example
   * const updatedCustomer = await customerService.updateCustomer('60d21b4667d0d8992e610c85', { name: 'Jane Doe' });
   */
  async updateCustomer(id, updateData) {
    try {
      const updatedCustomer = await this.repository.updateCustomer(id, updateData);
      debug.logger.info('Serviço: Cliente atualizado', { id, updateData });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao atualizar cliente', { id, error });
      throw error;
    }
  }

  /**
   * Deleta um cliente pelo ID.
   *
   * @param {string} id - ID do cliente a ser deletado.
   * @returns {Promise<Object>} O cliente deletado.
   * @throws {Error} Lança um erro caso ocorra falha na deleção.
   * @example
   * const deletedCustomer = await customerService.deleteCustomer('60d21b4667d0d8992e610c85');
   */
  async deleteCustomer(id) {
    try {
      const deletedCustomer = await this.repository.deleteCustomer(id);
      debug.logger.info('Serviço: Cliente deletado', { id });
      return deletedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao deletar cliente', { id, error });
      throw error;
    }
  }

  /**
   * Lista todos os clientes.
   *
   * @returns {Promise<Object[]>} Uma lista de todos os clientes.
   * @example
   * const customers = await customerService.listAllCustomers();
   */
  async listAllCustomers() {
    return await this.repository.listAllCustomers();
  }

  /**
   * Obtém um cliente e suas recompensas pelo ID do cliente.
   *
   * @param {string} customerId - ID do cliente a ser buscado.
   * @returns {Promise<{customer: Object, rewards: Object}>} O cliente e suas recompensas.
   * @throws {Error} Lança um erro caso o cliente não seja encontrado ou ocorra falha na busca.
   * @example
   * const customerWithRewards = await customerService.getCustomerWithRewards('60d21b4667d0d8992e610c85');
   */
}

export default CustomerService;
