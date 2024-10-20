import Service from '../../core/Service.js';
import debug from '../../../debug/index.js';
import { SALES } from '../../constants/index.js';
import AppError from '../../../errors/AppError.js';

class SalesService extends Service {
  constructor(repository, ticketService, customerRepository) {
    super(repository, SALES);
    this.ticketService = ticketService;
    this.customerRepository = customerRepository;
  }

  async applyDiscountIfTicketProvided({ ticketId, clientCPF, totalAmount }) {
    if (ticketId) {
      try {
        await this.ticketService.applyTicket(ticketId, clientCPF);
      } catch (error) {
        throw new AppError(400, 'Falha ao aplicar o ticket. Verifique se o ticket é válido.');
      }
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
      await this.ticketService.create(clientCPF, discountPercentage);
      debug.logger.info(`Serviço: Ticket de ${discountPercentage}% gerado para o cliente ${clientCPF}`);
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
      debug.logger.info(`Serviço: ${SALES} criada com sucesso`, { data: result });

      const newTicket = await this.generateTicketIfEligible({ clientCPF, totalAmount, ticketApplied });

      if (newTicket) {
        await this.customerRepository.addTicketToCustomer(clientCPF, newTicket._id);
      }

      return result;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao criar ${SALES}`, { error });
      throw error;
    }
  }
}

export default SalesService;
