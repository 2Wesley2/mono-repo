import Repository from '../../core/Repository.js';
import config from '../../../config/index.js';

class TicketRepository extends Repository {
  constructor(model) {
    super(model);
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
