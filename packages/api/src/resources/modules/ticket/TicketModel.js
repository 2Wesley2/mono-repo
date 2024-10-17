import Database from '../../../database/index.js';
import config from '../../../config/index.js';

const ticketSchema = {
  clientCPF: { type: String, required: true },
  discount: { type: Number, required: true },
  status: { type: String, enum: ['available', 'used', 'expired'], default: 'available' },
  expiryDate: { type: Date, required: true },
  generatedDate: { type: Date, default: Date.now },
};

const TicketSchema = Database.registerModel({
  schema: ticketSchema,
  modelName: 'Ticket',
});

class TicketModel {
  constructor() {
    this.model = TicketSchema;
  }

  async create(data) {
    try {
      const newTicket = this.model(data);
      const result = await newTicket.save();
      config.logger.info('Ticket criado com sucesso', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findById(ticketId) {
    try {
      const ticket = await this.model.findById(ticketId);
      if (!ticket) {
        config.logger.warn('Ticket não encontrado', { ticketId });
        return null;
      }
      config.logger.info('Ticket encontrado', { ticketId });
      return ticket;
    } catch (error) {
      config.logger.error('Erro ao buscar ticket por ID', { ticketId, error });
      throw error;
    }
  }

  async update(ticketId, data) {
    try {
      const updatedTicket = await this.model.findByIdAndUpdate(ticketId, data, { new: true });
      config.logger.info('Ticket atualizado', { ticketId, data: updatedTicket });
      return updatedTicket;
    } catch (error) {
      config.logger.error('Erro ao atualizar ticket', { ticketId, error });
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
      config.logger.info('Tickets expirados', { count: expiredTickets.modifiedCount });
      return expiredTickets;
    } catch (error) {
      config.logger.error('Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketModel;
