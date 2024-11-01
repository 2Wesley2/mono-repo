import debug from '../../../debug/index.js';

class CustomerService {
  constructor(repository) {
    this.repository = repository;
  }

  async createCustomer(customerData) {
    try {
      const newCustomer = await this.repository.createCustomer(customerData);
      debug.logger.info(`Serviço: Novo Cliente criado`, { customerData });
      return newCustomer;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao criar Cliente`, { customerData, error });
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updatedCustomer = await this.repository.update(id, updateData);
      debug.logger.info('Serviço: Cliente atualizado', { id, updateData });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao atualizar cliente', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedCustomer = await this.repository.delete(id);
      debug.logger.info('Serviço: Cliente deletado', { id });
      return deletedCustomer;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao deletar cliente', { id, error });
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
        throw new Error(`Cliente não encontrado`);
      }
      debug.logger.info(`Serviço: Cliente encontrado`, { cpf });
      return customer;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao buscar Cliente por CPF`, { cpf, error });
      throw error;
    }
  }

  async getAllCustomers(filters = {}, options = {}) {
    return await this.repository.findAll(filters, options);
  }

  async addTicketToCustomer(cpf, ticketId) {
    try {
      const updatedCustomer = await this.repository.addTicketToCustomer(cpf, ticketId);
      debug.logger.info(`Serviço: Ticket adicionado ao cliente Cliente`, { cpf, ticketId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao adicionar ticket ao cliente Cliente`, { cpf, ticketId, error });
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
