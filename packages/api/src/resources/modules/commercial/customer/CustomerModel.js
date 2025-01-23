import Model from '../../../../core/infrastructure/database/components/base/Model.js';
import { CUSTOMER, REWARD } from '../../../collections/index.js';

/**
 * Esquema para o modelo de cliente.
 *
 * @type {CustomerSchema}
 * @typedef {Object} CustomerSchema
 * @property {string} name - Nome do cliente.
 * @property {string} cpf - CPF do cliente (único e obrigatório).
 * @property {string} [email] - Email do cliente (único).
 * @property {string} phone - Telefone do cliente (único e obrigatório).
 * @property {import('mongoose').Types.ObjectId} [rewards] - ID de referência para as recompensas do cliente.
 * @property {number} [lifetimeValue=0] - Valor total acumulado pelo cliente.
 */
const customerSchema = {
  name: { type: String, required: true },
  cpf: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true, required: true },
  rewards: { type: Model.objectIdType, ref: REWARD, unique: true },
  lifetimeValue: { type: Number, default: 0 },
};

/**
 * Classe para interação com o modelo de Cliente no banco de dados.
 * Extende a classe base Model para herdar funcionalidades comuns.
 *
 * @class CustomerModel
 */

class CustomerModel extends Model {
  /**
   * Cria uma instância de CustomerModel.
   */
  constructor() {
    super(customerSchema, CUSTOMER);
  }

  /**
   * Cria um novo cliente no banco de dados.
   *
   * @param {Object} customerData - Dados do cliente a ser criado.
   * @returns {Promise<Object>} O cliente criado.
   * @example
   * const newCustomer = await customerModel.createCustomer({ name: 'John Doe', cpf: '12345678900', phone: '5551999999999' });
   */
  async createCustomer(customerData) {
    return await this.model.create(customerData);
  }

  /**
   * Busca um cliente pelo ID no banco de dados.
   *
   * @param {string} customerId - ID do cliente a ser buscado.
   * @returns {Promise<Object|null>} O cliente encontrado ou null se não existir.
   * @example
   * const customer = await customerModel.getCustomerById('60d21b4667d0d8992e610c85');
   */
  async getCustomerById(customerId) {
    return await this.model.findById(customerId);
  }

  /**
   * Lista todos os clientes do banco de dados com os dados de recompensas populados.
   *
   * @returns {Promise<Object[]>} Uma lista de todos os clientes.
   * @example
   * const customers = await customerModel.listAllCustomers();
   */
  async listAllCustomers() {
    return await this.model.find().populate('rewards').lean();
  }

  /**
   * Atualiza as informações de um cliente no banco de dados.
   *
   * @param {string} id - ID do cliente a ser atualizado.
   * @param {Object} updateData - Dados para atualização do cliente.
   * @returns {Promise<Object|null>} O cliente atualizado ou null se não encontrado.
   * @example
   * const updatedCustomer = await customerModel.updateCustomer('60d21b4667d0d8992e610c85', { name: 'Jane Doe' });
   */
  async updateCustomer(id, updateData) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  /**
   * Deleta um cliente do banco de dados pelo ID.
   *
   * @param {string} id - ID do cliente a ser deletado.
   * @returns {Promise<Object|null>} O cliente deletado ou null se não encontrado.
   * @example
   * const deletedCustomer = await customerModel.deleteCustomer('60d21b4667d0d8992e610c85');
   */
  async deleteCustomer(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default CustomerModel;
