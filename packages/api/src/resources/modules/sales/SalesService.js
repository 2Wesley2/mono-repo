import config from '../../../config/index.js';

class SalesService {
  constructor(repository, ticketService) {
    this.repository = repository;
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

  async findById(id) {
    try {
      const sale = await this.repository.findById(id);
      config.logger.info('Serviço: Venda encontrada', { id });
      return sale;
    } catch (error) {
      config.logger.error('Serviço: Erro ao buscar venda por ID', { id, error });
      throw error;
    }
  }

  async update(id, data) {
    try {
      const result = await this.repository.update(id, data);
      config.logger.info('Serviço: Venda atualizada', { id, data: result });
      return result;
    } catch (error) {
      config.logger.error('Serviço: Erro ao atualizar venda', { id, error });
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.repository.delete(id);
      config.logger.info('Serviço: Venda deletada', { id });
      return true;
    } catch (error) {
      config.logger.error('Serviço: Erro ao deletar venda', { id, error });
      throw error;
    }
  }
}

export default SalesService;
