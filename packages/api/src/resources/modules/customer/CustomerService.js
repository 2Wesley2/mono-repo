import debug from '../../../debug/index.js';
import { CUSTOMER } from '../../constants/index.js';

class CustomerService {
  constructor(repository) {
    this.repository = repository;
  }

  async createCustomer(customerData) {
    try {
      const newCustomer = await this.repository.createCustomer(customerData);
      debug.logger.info(`Serviço: Novo ${CUSTOMER} criado`, { customerData });
      return newCustomer;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao criar ${CUSTOMER}`, { customerData, error });
      throw error;
    }
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.repository.findByCPF(cpf);
      if (!customer) {
        throw new Error(`${CUSTOMER} não encontrado`);
      }
      debug.logger.info(`Serviço: ${CUSTOMER} encontrado`, { cpf });
      return customer;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao buscar ${CUSTOMER} por CPF`, { cpf, error });
      throw error;
    }
  }

  async addTicketToCustomer(cpf, ticketId) {
    try {
      const updatedCustomer = await this.repository.addTicketToCustomer(cpf, ticketId);
      debug.logger.info(`Serviço: Ticket adicionado ao cliente ${CUSTOMER}`, { cpf, ticketId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao adicionar ticket ao cliente ${CUSTOMER}`, { cpf, ticketId, error });
      throw error;
    }
  }
}

export default CustomerService;
