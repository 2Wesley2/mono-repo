import Repository from '../../core/Repository.js';
import debug from '../../../debug/index.js';
import { TICKET } from '../../constants/index.js';
class TicketRepository extends Repository {
  constructor(model) {
    super(model, TICKET);
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
