import debug from '../../../debug/index.js';
import { CUSTOMER } from '../../constants/index.js';
import Database from '../../../database/index.js';

class CustomerRepository {
  constructor(model) {
    this.model = model;
  }

  async createCustomer(customerData) {
    try {
      const newCustomer = await this.model.create(customerData);
      debug.logger.info(`CustomerRepository.js: Novo Customer criado`, { customerData });
      return newCustomer;
    } catch (error) {
      debug.logger.error(`CustomerRepository.js: Erro ao criar Customer`, { customerData, error });
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updatedCustomer = await this.model.update(id, updateData);
      debug.logger.info('CustomerRepository.js: Cliente atualizado', { id, updateData });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('CustomerRepository.js: Erro ao atualizar cliente', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedCustomer = await this.model.delete(id);
      debug.logger.info('CustomerRepository.js: Cliente deletado', { id });
      return deletedCustomer;
    } catch (error) {
      debug.logger.error('CustomerRepository.js: Erro ao deletar cliente', { id, error });
      throw error;
    }
  }

  async findByCPF(cpf) {
    try {
      const customer = await this.model.findByCPF(cpf);
      debug.logger.info(`CustomerRepository.js: Customer encontrado`, { cpf });
      return customer;
    } catch (error) {
      debug.logger.error(`CustomerRepository.js: Erro ao buscar Customer por CPF`, { cpf, error });
      throw error;
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      const documents = await this.model.findAll(filters, options);
      debug.logger.info('CustomerRepository.js: Documentos encontrados', { filters });
      return documents;
    } catch (error) {
      debug.logger.error('CustomerRepository.js: Erro ao buscar documentos', {
        filters,
        error: error && error.message ? error.message : 'Erro desconhecido',
      });
      throw new Error('Erro ao buscar documentos no CustomerRepository.js.');
    }
  }

  async addTicketToCustomer(cpf, ticketId) {
    try {
      const updatedCustomer = await this.model.addTicket(cpf, ticketId);

      if (!updatedCustomer?.cpf) {
        debug.logger.warn('Cliente atualizado não contém clientCPF', { cpf });
      } else {
        debug.logger.info('Cliente atualizado com sucesso', { cpf: updatedCustomer.cpf });
      }

      debug.logger.info(`CustomerRepository.js: Ticket adicionado ao cliente`, { cpf, ticketId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error(`CustomerRepository.js: Erro ao adicionar ticket ao Customer`, { cpf, ticketId, error });
      throw error;
    }
  }

  async getTicketsByCustomer(cpf) {
    try {
      debug.logger.info(`CustomerRepository.js: Iniciando busca de tickets para o ${cpf}`);
      const tickets = await this.model.getTicketsByCustomer(cpf);

      debug.logger.info('CustomerRepository.js: Tickets do cliente recuperados', {
        cpf,
        ticketsCount: tickets.length,
        tickets,
      });

      return tickets;
    } catch (error) {
      debug.logger.error('CustomerRepository.js: Erro ao recuperar tickets do cliente', { cpf, error });
      throw error;
    }
  }

  async addPurchaseToHistory(cpf, saleId) {
    if (!Database.isValidObjectId(saleId)) {
      debug.logger.error(`CustomerRepository.js: saleId inválido`, { cpf, saleId });
      throw new Error('saleId inválido');
    }
    try {
      const updatedCustomer = await this.model.addPurchaseToHistory(cpf, saleId);
      debug.logger.info('CustomerRepository.js: Compra adicionada ao histórico do cliente', { cpf, saleId });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('CustomerRepository.js: Erro ao adicionar compra ao histórico do cliente', {
        cpf,
        saleId,
        error,
      });
      throw error;
    }
  }

  async updateLifetimeValue(cpf, amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      debug.logger.error(`CustomerRepository.js: Valor amount inválido`, { cpf, amount });
      throw new Error('Valor amount inválido');
    }

    try {
      const updatedCustomer = await this.model.updateLifetimeValue(cpf, amount);
      debug.logger.info('CustomerRepository.js: Valor vitalício atualizado para o cliente', { cpf, amount });
      return updatedCustomer;
    } catch (error) {
      debug.logger.error('CustomerRepository.js: Erro ao atualizar valor vitalício do cliente', { cpf, amount, error });
      throw error;
    }
  }
}

export default CustomerRepository;
