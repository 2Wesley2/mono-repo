import debug from '../../../debug/index.js';
class TicketRepository {
  constructor(model) {
    this.model = model;
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
