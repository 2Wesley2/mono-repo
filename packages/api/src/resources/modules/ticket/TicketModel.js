import Model from '../../core/Model.js';
import config from '../../../config/index.js';
import { TICKET } from '../../constants/index.js';

const ticketSchema = {
  clientCPF: { type: String, required: true },
  discount: { type: Number, required: true },
  status: { type: String, enum: ['available', 'used', 'expired'], default: 'available' },
  expiryDate: { type: Date, required: true },
  generatedDate: { type: Date, default: Date.now },
};

class TicketModel extends Model {
  constructor() {
    super(ticketSchema, TICKET);
  }

  async expireTickets() {
    try {
      const now = new Date();
      const expiredTickets = await this.model.updateMany(
        { expiryDate: { $lt: now }, status: 'available' },
        { status: 'expired' },
      );
      config.logger.info('Tickets expirados', { count: expiredTickets.modifiedCount });
      return expiredTickets;
    } catch (error) {
      config.logger.error('Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketModel;
