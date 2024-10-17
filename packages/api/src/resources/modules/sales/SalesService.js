import Service from '../../core/Service.js';
import config from '../../../config/index.js';

class SalesService extends Service {
  constructor(repository, ticketService) {
    super(repository);
    this.ticketService = ticketService;
  }

  async applyDiscountIfTicketProvided({ ticketId, clientCPF, totalAmount }) {
    if (ticketId) {
      await this.ticketService.applyTicket(ticketId, clientCPF);
      const ticket = await this.ticketService.findById(ticketId);
      const discount = ticket.discount;
      const finalAmount = totalAmount - totalAmount * (discount / 100);
      return { discount, finalAmount, ticketApplied: true };
    }
    return { discount: 0, finalAmount: totalAmount, ticketApplied: false };
  }

  async generateTicketIfEligible({ clientCPF, totalAmount, ticketApplied }) {
    if (ticketApplied) {
      return;
    }
    let discountPercentage = 0;
    if (totalAmount >= 50 && totalAmount <= 100) {
      discountPercentage = 5;
    } else if (totalAmount > 100 && totalAmount <= 150) {
      discountPercentage = 10;
    } else if (totalAmount > 150) {
      discountPercentage = 15;
    }

    if (discountPercentage > 0) {
      const ticketData = {
        clientCPF,
        discount: discountPercentage,
      };

      await this.ticketService.create(ticketData);
      config.logger.info(`Serviço: Ticket de ${discountPercentage}% gerado para o cliente ${clientCPF}`);
    }
  }

  async create(data) {
    try {
      const { clientCPF, totalAmount, ticketId } = data;
      const { discount, finalAmount, ticketApplied } = await this.applyDiscountIfTicketProvided({
        ticketId,
        clientCPF,
        totalAmount,
      });

      const saleData = {
        clientCPF,
        totalAmount,
        discount,
        finalAmount,
        ticketApplied,
      };

      const result = await this.repository.create(saleData);
      config.logger.info('Serviço: Venda criada com sucesso', { data: result });
      await this.generateTicketIfEligible({ clientCPF, totalAmount, ticketApplied });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao criar venda', { error });
      throw error;
    }
  }
}

export default SalesService;
