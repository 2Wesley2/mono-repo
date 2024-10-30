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
      if (!cpf) {
        throw new Error('CPF não pode ser nulo');
      }
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

  async getAllCustomers(filters = {}, options = {}) {
    return await this.repository.findAll(filters, options);
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

  async getTicketsByCustomer(cpf) {
    try {
      debug.logger.info(`CustomerService.js: Iniciando recuperação de tickets para o ${cpf}`);
      const tickets = await this.repository.getTicketsByCustomer(cpf);

      debug.logger.info(`CustomerService.js: ${tickets} recuperados com sucesso`, {
        cpf,
        ticketsCount: tickets.length,
        tickets,
      });

      return tickets;
    } catch (error) {
      debug.logger.error(`CustomerService.js: Erro ao recuperar tickets para o ${cpf}`, { error: error.message });
      throw error;
    }
  }
}

export default CustomerService;
