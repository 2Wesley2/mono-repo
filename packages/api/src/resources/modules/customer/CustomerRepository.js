import debug from '../../../debug/index.js';
import { CUSTOMER } from '../../constants/index.js';

class CustomerRepository {
  constructor(model) {
    this.model = model;
  }

  async createCustomer(customerData) {
    try {
      const newCustomer = await this.model.create(customerData);
      debug.logger.info(`Repositório: Novo ${CUSTOMER} criado`, { customerData });
      return newCustomer;
    } catch (error) {
      debug.logger.error(`Repositório: Erro ao criar ${CUSTOMER}`, { customerData, error });
      throw error;
    }
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.model.findByCPF(cpf);
      debug.logger.info(`Repositório: ${CUSTOMER} encontrado`, { cpf });
      return customer;
    } catch (error) {
      debug.logger.error(`Repositório: Erro ao buscar ${CUSTOMER} por CPF`, { cpf, error });
      throw error;
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      const documents = await this.model.findAll(filters, options);
      debug.logger.info('Repositório: Documentos encontrados', { filters });
      return documents;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar documentos', {
        filters,
        error: error && error.message ? error.message : 'Erro desconhecido',
      });
      throw new Error('Erro ao buscar documentos no repositório.');
    }
  }

  async addTicketToCustomer(cpf, ticketId) {
    try {
      const updatedCustomer = await this.model.addTicket(cpf, ticketId);
      debug.logger.info(`Repositório: Ticket adicionado ao cliente ${CUSTOMER}`, { cpf, ticketId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error(`Repositório: Erro ao adicionar ticket ao ${CUSTOMER}`, { cpf, ticketId, error });
      throw error;
    }
  }

  async getTicketsByCustomer(cpf) {
    try {
      debug.logger.info('Repositório: Iniciando consulta de tickets no banco de dados', { cpf });

      const customer = await this.model.getTicketsByCustomer(cpf);
      debug.logger.info('Repositório: Tickets encontrados para o cliente', {
        cpf,
        ticketsCount: customer ? (customer.tickets || []).length : 0,
      });

      return (customer ? customer.tickets : []) || [];
    } catch (error) {
      debug.logger.error('Repositório: Erro ao recuperar tickets do cliente', { cpf, error: error.message });
      throw error;
    }
  }
}

export default CustomerRepository;
