/**
 * Serviço para gerenciar operações relacionadas às recompensas dos clientes.
 *
 * @class RewardService
 */
class RewardService {
  /**
   * Cria uma instância de RewardService.
   *
   * @param {Object} repository - Repositório para manipulação de dados de recompensa.
   * @param {Object} calcRef - Referência para cálculos adicionais relacionados a recompensas.
   */
  constructor(repository, calcRef) {
    this.repository = repository;
    this.calcRef = calcRef;
  }

  /**
   * Verifica o saldo de um cliente pelo ID.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - ID do cliente a ser verificado.
   * @returns {Promise<number>} O saldo atual do cliente.
   * @example
   * const balance = await rewardService.checkBalanceByCustomer('60d21b4667d0d8992e610c85');
   */
  async checkBalanceByCustomer(customerId) {
    return await this.repository.getCurrentCashByCustomerId(customerId);
  }

  /**
   * Adiciona valor monetário ao saldo de um cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - ID do cliente.
   * @param {number} totalAmount - Valor base a ser adicionado ao saldo do cliente.
   * @returns {Promise<import('mongoose').Document|null>} Documento atualizado da recompensa ou null se não encontrado.
   * @throws {Error} Se o saldo atualizado for menor que o saldo atual.
   * @example
   * const updatedReward = await rewardService.addCashAtCustomer('60d21b4667d0d8992e610c85', 100);
   */
  async addCashAtCustomer(customerId, totalAmount) {
    const numberBase = await this.calcRef.getBaseValue();
    const cashWon = totalAmount * numberBase;
    const currentCash = await this.repository.getCurrentCashByCustomerId(customerId);
    const updatedCash = currentCash + cashWon;
    if (updatedCash < currentCash) {
      throw new Error(
        `Erro na soma: O saldo atualizado (${updatedCash}) não pode ser menor que o saldo atual (${currentCash}).`,
      );
    }
    return await this.repository.addCashAtCustomer(customerId, updatedCash);
  }

  /**
   * Subtrai valor monetário do saldo de um cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - ID do cliente.
   * @param {number} cashSpent - Valor a ser subtraído do saldo do cliente.
   * @returns {Promise<import('mongoose').Document|null>} Documento atualizado da recompensa ou null se não encontrado.
   * @throws {Error} Se o saldo atual for insuficiente ou não atender ao saldo mínimo necessário.
   * @example
   * const updatedReward = await rewardService.subtractCashAtCustomer('60d21b4667d0d8992e610c85', 50);
   */
  async subtractCashAtCustomer(customerId, cashSpent) {
    const currentCash = await this.repository.getCurrentCashByCustomerId(customerId);
    const minimumRedeemAmount = await this.calcRef.getMinimumRedeemAmount();

    if (currentCash < minimumRedeemAmount) {
      throw new Error(
        `É necessário um saldo mínimo para resgate. Saldo atual: ${currentCash}, saldo mínimo necessário: ${minimumRedeemAmount} `,
      );
    }

    const updatedCash = currentCash - cashSpent;

    if (updatedCash < 0) {
      throw new Error(`Saldo insuficiente. Saldo atual:${currentCash} `);
    }
    if (updatedCash > currentCash) {
      throw new Error(
        `Erro na subtração: O saldo atualizado (${updatedCash}) não pode ser maior que o saldo atual (${currentCash}).`,
      );
    }
    return await this.repository.subtractCashAtCustomer(customerId, updatedCash);
  }
}

export default RewardService;
