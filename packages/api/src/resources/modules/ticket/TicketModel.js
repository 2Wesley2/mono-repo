import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
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

  async create(data) {
    try {
      const ticket = await this.model.create(data);
      debug.logger.info('Modelo: Ticket criado com sucesso', { ticket });
      return ticket;
    } catch (error) {
      debug.logger.error('Modelo: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findById(ticketId) {
    try {
      const ticket = await this.model.findOne({ _id: ticketId });
      if (!ticket) {
        debug.logger.warn('Modelo: Ticket não encontrado', { ticketId });
      }
      return ticket;
    } catch (error) {
      debug.logger.error('Modelo: Erro ao buscar ticket por ID', { ticketId, error });
      throw error;
    }
  }

  async update(ticketId, updateData) {
    try {
      const updatedTicket = await this.model.updateOne({ _id: ticketId }, updateData);
      debug.logger.info('Modelo: Ticket atualizado com sucesso', { ticketId, updateData });
      return updatedTicket;
    } catch (error) {
      debug.logger.error('Modelo: Erro ao atualizar ticket', { ticketId, updateData, error });
      throw error;
    }
  }

  async expireTickets() {
    try {
      const now = new Date();
      const expiredTickets = await this.model.updateMany(
        { expiryDate: { $lt: now }, status: 'available' },
        { status: 'expired' },
      );
      debug.logger.info('Tickets expirados', { count: expiredTickets.modifiedCount });
      return expiredTickets;
    } catch (error) {
      debug.logger.error('Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketModel;
