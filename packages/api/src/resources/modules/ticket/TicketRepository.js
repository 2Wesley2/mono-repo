import debug from '../../../debug/index.js';

class TicketRepository {
  constructor(model) {
    this.model = model;
  }

  async createTicket(data) {
    try {
      const ticket = await this.model.createTicket(data);
      debug.logger.info('Repositório: Ticket criado com sucesso', { ticket });
      return ticket;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findByIdTicket(ticketId) {
    try {
      const ticket = await this.model.findByIdTicket(ticketId);
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

  async updateTicket(ticketId, updateData) {
    try {
      const updatedTicket = await this.model.updateTicket(ticketId, updateData);
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

  async findTicketsExpiringSoon(daysUntilExpiry) {
    try {
      const tickets = await this.model.findTicketsExpiringSoon(daysUntilExpiry);
      debug.logger.info('Repositório: Tickets próximos de expirar recuperados', { count: tickets.length });
      return tickets;
    } catch (error) {
      debug.logger.error('Repositório: Erro ao buscar tickets próximos de expirar', { error });
      throw error;
    }
  }
}

export default TicketRepository;
