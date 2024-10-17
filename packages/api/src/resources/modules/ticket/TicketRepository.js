import config from '../../../config/index.js';

class TicketRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      config.logger.info('Repositório: Ticket criado', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findById(ticketId) {
    try {
      const ticket = await this.model.findById(ticketId);
      config.logger.info('Repositório: Ticket encontrado', { ticketId });
      return ticket;
    } catch (error) {
      config.logger.error('Repositório: Erro ao buscar ticket por ID', { ticketId, error });
      throw error;
    }
  }

  async update(ticketId, data) {
    try {
      const result = await this.model.update(ticketId, data);
      config.logger.info('Repositório: Ticket atualizado', { ticketId, data: result });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao atualizar ticket', { ticketId, error });
      throw error;
    }
  }

  async expireTickets() {
    try {
      const result = await this.model.expireTickets();
      config.logger.info('Repositório: Tickets expirados', { count: result.modifiedCount });
      return result;
    } catch (error) {
      config.logger.error('Repositório: Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketRepository;
