import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { TICKET, SALES } from '../../constants/index.js';
import Database from '../../../database/index.js';

const ticketSchema = {
  clientCPF: { type: String, required: true },
  discount: { type: Number, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  status: { type: String, enum: ['available', 'used', 'expired'], default: 'available' },
  expiryDate: { type: Date, required: true },
  generatedDate: { type: Date, default: Date.now },
  usedDate: { type: Date },
  appliedToSale: {
    type: Database.ObjectId,
    ref: SALES,
  },
};

//CRIAR MÉTOD QUE ATUALIZA APPLIEDTOSALE
class TicketModel extends Model {
  constructor() {
    super(ticketSchema, TICKET);
  }

  async createTicket(data) {
    try {
      const ticket = await this.model.create(data);
      debug.logger.info('Modelo: Ticket criado com sucesso', { ticket });
      return ticket;
    } catch (error) {
      debug.logger.error('Modelo: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findByIdTicket(ticketId) {
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

  async updateTicket(ticketId, updateData) {
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

  async findTicketsExpiringSoon(daysUntilExpiry = 7) {
    try {
      const today = new Date();
      const expiryThreshold = new Date();
      expiryThreshold.setDate(today.getDate() + daysUntilExpiry);

      const expiringTickets = await this.model.find({
        expiryDate: { $gte: today, $lte: expiryThreshold },
        status: 'available',
      });

      debug.logger.info('Modelo: Tickets próximos de expirar encontrados', { count: expiringTickets.length });
      return expiringTickets;
    } catch (error) {
      debug.logger.error('Modelo: Erro ao buscar tickets próximos de expirar', { error });
      throw error;
    }
  }
}

export default TicketModel;
