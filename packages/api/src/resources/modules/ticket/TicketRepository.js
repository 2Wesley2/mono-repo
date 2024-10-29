// TicketRepository.js

import debug from '../../../debug/index.js';

class TicketRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const ticket = await this.model.create(data);
      debug.logger.info('Repositório: Ticket criado com sucesso', { ticket });
      return ticket;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findById(ticketId) {
    try {
      const ticket = await this.model.findById(ticketId);
      if (!ticket) {
        debug.logger.warn('Repositório: Ticket não encontrado', { ticketId });
      } else {
        debug.logger.info('Repositório: Ticket encontrado', { ticket });
      }
      return ticket;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar ticket', { ticketId, error });
      throw error;
    }
  }

  async update(ticketId, updateData) {
    try {
      const updatedTicket = await this.model.update(ticketId, updateData);
      debug.logger.info('Repositório: Ticket atualizado com sucesso', { ticketId, updateData });
      return updatedTicket;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao atualizar ticket', { ticketId, updateData, error });
      throw error;
    }
  }

  async expireTickets() {
    try {
      const result = await this.model.expireTickets();
      debug.logger.info('Repositório: Tickets expirados', { count: result.modifiedCount });
      return result;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketRepository;
