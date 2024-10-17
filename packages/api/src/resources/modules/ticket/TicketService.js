import Service from '../../core/Service.js';
import config from '../../../config/index.js';

function validateTicket(ticket, clientCPF) {
  if (!ticket) {
    config.logger.error('Ticket não encontrado');
    throw new Error('Ticket não encontrado.');
  }

  if (ticket.clientCPF !== clientCPF) {
    config.logger.error('O ticket não pertence ao cliente informado.', { ticketCPF: ticket.clientCPF, clientCPF });
    throw new Error('O ticket não pertence ao cliente informado.');
  }

  if (ticket.status !== 'available') {
    config.logger.error('O ticket não está disponível para uso.', { ticketId: ticket._id, status: ticket.status });
    throw new Error('O ticket não está disponível para uso.');
  }
}

class TicketService extends Service {
  constructor(repository) {
    super(repository);
  }

  async create(clientCPF, discount) {
    try {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      const data = { clientCPF, discount, expiryDate };
      const result = await this.repository.create(data);
      config.logger.info('Serviço: Ticket criado com sucesso', { data: result });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao criar ticket', { error });
      throw error;
    }
  }

  async applyTicket(ticketId, clientCPF) {
    try {
      const ticket = await this.repository.findById(ticketId);
      validateTicket(ticket, clientCPF);
      const updatedTicket = await this.repository.update(ticketId, { status: 'used' });
      config.logger.info('Serviço: Ticket aplicado', { ticketId });
      return updatedTicket;
    } catch (error) {
      config.logger.error('Serviço: Erro ao aplicar ticket', { ticketId, error });
      throw error;
    }
  }

  async expireTickets() {
    try {
      const result = await this.repository.expireTickets();
      config.logger.info('Serviço: Tickets expirados', { count: result.modifiedCount });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao expirar tickets', { error });
      throw error;
    }
  }
}

export default TicketService;
