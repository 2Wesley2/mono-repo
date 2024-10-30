import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

function validateTicket(ticket, clientCPF) {
  if (!ticket) {
    debug.logger.error('Ticket não encontrado');
    throw new AppError(404, 'Ticket não encontrado.');
  }

  if (ticket.clientCPF !== clientCPF) {
    debug.logger.error('O ticket não pertence ao cliente informado.', { ticketCPF: ticket.clientCPF, clientCPF });
    throw new AppError(404, 'Ticket não encontrado.');
  }

  if (ticket.status !== 'available') {
    debug.logger.error('O ticket não está disponível para uso.', { ticketId: ticket._id, status: ticket.status });
    throw new AppError(404, 'Ticket não encontrado.');
  }
}

class TicketService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(clientCPF, discount) {
    try {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      const data = { clientCPF, discount, expiryDate };
      const result = await this.repository.create(data);
      debug.logger.info('Serviço: Ticket criado com sucesso', { data: result });
      return result;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async findById(ticketId) {
    try {
      const ticket = await this.repository.findById(ticketId);
      if (!ticket) {
        debug.logger.warn('Serviço: Ticket não encontrado', { ticketId });
      } else {
        debug.logger.info('Serviço: Ticket encontrado', { ticket });
      }
      return ticket;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao buscar ticket por ID', { ticketId, error });
      throw error;
    }
  }

  async applyTicket(ticketId, clientCPF) {
    try {
      const ticket = await this.repository.findById(ticketId);
      validateTicket(ticket, clientCPF);
      const updatedTicket = await this.repository.update(ticketId, { status: 'used' });
      debug.logger.info('Serviço: Ticket aplicado', { ticketId });
      return updatedTicket;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao aplicar ticket', { ticketId, error });
      throw error;
    }
  }

  async expireTickets() {
    try {
      const result = await this.repository.expireTickets();
      debug.logger.info('Serviço: Tickets expirados', { count: result.modifiedCount });
      return result;
    } catch (error) {
      debug.logger.error('Serviço: Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketService;
