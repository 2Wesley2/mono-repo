import Repository from '../../core/Repository.js';
import config from '../../../config/index.js';
import { TICKET } from '../../constants/index.js';
class TicketRepository extends Repository {
  constructor(model) {
    super(model, TICKET);
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
