import debug from '../../../debug/index.js';
import AppError from '../../../errors/AppError.js';

class SalesService {
  constructor(repository, ticketService, customerRepository, notificationService, cashbackService) {
    this.repository = repository;
    this.ticketService = ticketService;
    this.customerRepository = customerRepository;
    this.notificationService = notificationService;
    this.cashbackService = cashbackService;
  }

  async create(data) {
    debug.logger.info('Serviço: Iniciando criação de venda', { data });
    try {
      const saleData = await this._prepareSaleData(data);
      debug.logger.info('Serviço: Dados de venda preparados', { saleData });

      const newSale = await this.repository.createSale(saleData);
      debug.logger.info(`Serviço: Venda criada com sucesso`, { data: newSale });

      await this._updateCustomerData(saleData.clientCPF, newSale._id, saleData.finalAmount);
      debug.logger.info('Serviço: Dados do cliente atualizados com sucesso', { clientCPF: saleData.clientCPF });

      const newTicket = await this.generateTicketIfEligible({
        clientCPF: saleData.clientCPF,
        totalAmount: saleData.totalAmount,
        ticketApplied: saleData.ticketApplied,
      });

      if (newTicket) {
        await this._handleNewTicketNotification(saleData.clientCPF, newTicket, newSale);
      } else {
        debug.logger.info('Serviço: Nenhum ticket gerado para essa venda', { clientCPF: saleData.clientCPF });
      }

      return newSale;
    } catch (error) {
      debug.logger.error(`Serviço: Erro ao criar Venda`, { error });
      throw error;
    }
  }

  async applyDiscountIfTicketProvided({ ticketId, clientCPF, totalAmount }) {
    debug.logger.info('Serviço: Iniciando aplicação de desconto', { ticketId, clientCPF, totalAmount });
    if (ticketId) {
      try {
        const ticket = await this.ticketService.findByIdTicket(ticketId);
        debug.logger.info('Serviço: Ticket encontrado para aplicação de desconto', { ticketId });

        if (ticket.status !== 'available') {
          debug.logger.warn('Serviço: Ticket não disponível para aplicação de desconto', { ticketId });
          throw new AppError(400, 'Ticket inválido. Status do ticket não permite aplicação de desconto.');
        }

        await this.ticketService.applyTicket(ticketId, clientCPF);
        debug.logger.info('Serviço: Desconto aplicado com sucesso usando o ticket', { ticketId, clientCPF });
      } catch (error) {
        debug.logger.error('Serviço: Erro ao aplicar desconto com ticket', { ticketId, clientCPF, error });
        throw new AppError(400, 'Falha ao aplicar o ticket. Verifique se o ticket é válido.');
      }

      const ticket = await this.ticketService.findByIdTicket(ticketId);
      const discount = ticket.discount;
      const finalAmount = totalAmount - totalAmount * (discount / 100);
      debug.logger.info('Serviço: Desconto calculado', { discount, finalAmount });

      return { discount, finalAmount, ticketApplied: true };
    }
    debug.logger.info('Serviço: Nenhum ticket fornecido, aplicando total sem desconto', { totalAmount });
    return { discount: 0, finalAmount: totalAmount, ticketApplied: false };
  }

  async generateTicketIfEligible({ clientCPF, totalAmount, ticketApplied }) {
    debug.logger.info('Serviço: Verificando elegibilidade para geração de novo ticket', { clientCPF, totalAmount });

    if (ticketApplied) {
      debug.logger.info('Serviço: Ticket já aplicado, não é elegível para novo ticket', { clientCPF });
      return;
    }

    const discountData = await this._determineDiscountPercentage(totalAmount);
    debug.logger.info(`Serviço: Dados do desconto determinados: ${JSON.stringify(discountData)}`);

    if (discountData.discountType) {
      const newTicket = await this.ticketService.create(
        clientCPF,
        discountData.discountValue,
        discountData.discountType,
      );
      debug.logger.info(
        `Serviço: Ticket de ${discountData.discountValue}${discountData.discountType === 'percentage' ? '%' : ''} gerado para o cliente ${clientCPF}`,
      );
      return newTicket;
    }

    debug.logger.info('Serviço: Cliente não elegível para geração de ticket', { clientCPF });
    return null;
  }

  async _prepareSaleData(data) {
    debug.logger.info('Serviço: Preparando dados de venda', { data });
    const { clientCPF, totalAmount, ticketId } = data;
    const { discount, finalAmount, ticketApplied } = await this.applyDiscountIfTicketProvided({
      ticketId,
      clientCPF,
      totalAmount,
    });
    const preparedData = { clientCPF, totalAmount, discount, finalAmount, ticketApplied };
    debug.logger.info('Serviço: Dados de venda preparados', { preparedData });
    return preparedData;
  }

  async _updateCustomerData(clientCPF, saleId, finalAmount) {
    debug.logger.info('Serviço: Atualizando dados do cliente', { clientCPF, saleId, finalAmount });
    await this.customerRepository.addPurchaseToHistory(clientCPF, saleId);
    await this.customerRepository.updateLifetimeValue(clientCPF, finalAmount);
    debug.logger.info('Serviço: Dados do cliente atualizados com sucesso', { clientCPF });
  }

  async _handleNewTicketNotification(clientCPF, newTicket, newSale) {
    debug.logger.info('Serviço: Iniciando notificação de novo ticket', { clientCPF, newTicket });

    const clienteAtualizado = await this.customerRepository.addTicketToCustomer(clientCPF, newTicket._id);

    if (!clienteAtualizado?.cpf) {
      debug.logger.warn('Cliente atualizado não possui clientCPF; usando o CPF fornecido para logs', { clientCPF });
    }

    debug.logger.info(`Serviço: Ticket ${newTicket._id} associado ao cliente`, {
      ticketId: newTicket._id,
      cpf: clienteAtualizado?.cpf || clientCPF,
    });

    const message = `Parabéns! Você ganhou um ticket de desconto. ID do Ticket: ${newTicket._id}`;

    if (!clienteAtualizado.phone && !clienteAtualizado.email) {
      debug.logger.warn('Serviço: Cliente sem canal de contato disponível para notificação', { clientCPF });
      throw new AppError(400, 'Cliente não possui nenhum canal de contato disponível para notificação.');
    }

    const canaisNotificacao = await this.notificationService.sendToAllChannels(clienteAtualizado, message);
    debug.logger.info('Serviço: Notificação enviada através dos canais disponíveis', { clientCPF, canaisNotificacao });

    await this._registerNotificationIfSent(canaisNotificacao, newTicket, clienteAtualizado, newSale, message);
  }

  async _registerNotificationIfSent(canaisNotificacao, newTicket, clienteAtualizado, newSale, message) {
    debug.logger.info('Serviço: Registrando notificação se enviada com sucesso', { newTicket, clienteAtualizado });

    const envioSucesso = Object.values(canaisNotificacao).some((status) => status && status.includes('enviado'));

    if (envioSucesso) {
      await this.notificationService.register({
        ticket: newTicket._id,
        customer: clienteAtualizado._id,
        sale: newSale._id,
        mensagem: message,
        dataEnvio: new Date(),
      });
      debug.logger.info(`Notificação registrada e enviada para o cliente ${clienteAtualizado.name}`, { message });
    } else {
      debug.logger.warn('Serviço: Nenhum canal disponível para registro de notificação', { clienteAtualizado });
    }
  }

  async _determineDiscountPercentage(totalAmount) {
    const activeCashback = await this.cashbackService.findActiveCashback();
    debug.logger.info('Serviço: Determinando desconto aplicável com base no totalAmount', { totalAmount });

    // Ordena os tiers em ordem decrescente de `minPurchaseAmount`
    const sortedTiers = activeCashback.ruleDiscont.sort((a, b) => b.minPurchaseAmount - a.minPurchaseAmount);

    for (const tier of sortedTiers) {
      if (totalAmount >= tier.minPurchaseAmount && totalAmount <= tier.maxPurchaseAmount) {
        if (tier.discountType === 'percentage') {
          debug.logger.info(`Desconto percentual aplicável encontrado: ${tier.discountPercentage}%`);
          return {
            discountType: 'percentage',
            discountValue: tier.discountPercentage,
          };
        } else if (tier.discountType === 'fixed') {
          debug.logger.info(`Desconto fixo aplicável encontrado: ${tier.discountFixedValue}`);
          return {
            discountType: 'fixed',
            discountValue: tier.discountFixedValue,
          };
        }
      }
    }

    debug.logger.info('Nenhum desconto aplicável para o valor total informado', { totalAmount });
    return { discountType: null, discountValue: 0 };
  }
}

export default SalesService;
