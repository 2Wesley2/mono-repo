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
}

export default CustomerRepository;
