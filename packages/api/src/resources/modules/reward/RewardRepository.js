/**
 * Repositório para operações de recompensa no banco de dados.
 *
 * @class RewardRepository
 */
class RewardRepository {
  /**
   * Cria uma instância de RewardRepository.
   *
   * @param {RewardModel} model - Modelo de Recompensa para interação com o banco de dados.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Obtém a recompensa associada a um cliente pelo ID do cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente para buscar a recompensa.
   * @returns {Promise<import('mongoose').Document|null>} Documento da recompensa ou null se não encontrado.
   * @example
   * const reward = await rewardRepository.getRewardByCustomerId('60d21b4667d0d8992e610c85');
   */
  async getRewardByCustomerId(customerId) {
    return await this.model.getRewardByCustomerId(customerId);
  }

  /**
   * Atualiza a recompensa associada a um cliente pelo ID do cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente cuja recompensa será atualizada.
   * @param {Object} updatedData - Dados atualizados para a recompensa.
   * @param {number} [updatedData.points] - Nova pontuação.
   * @param {number} [updatedData.cash] - Novo valor monetário.
   * @returns {Promise<import('mongoose').Document|null>} Documento atualizado da recompensa ou null se não encontrado.
   * @example
   * const updatedReward = await rewardRepository.updateRewardByCustomerId('60d21b4667d0d8992e610c85', { points: 50 });
   */
  async updateRewardByCustomerId(customerId, updatedData) {
    return await this.model.updateRewardByCustomerId(customerId, updatedData);
  }

  /**
   * Adiciona valor monetário à recompensa de um cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente.
   * @param {number} updatedCash - Valor monetário a ser adicionado.
   * @returns {Promise<import('mongoose').Document|null>} Documento atualizado da recompensa ou null se não encontrado.
   * @example
   * const updatedReward = await rewardRepository.addCashAtCustomer('60d21b4667d0d8992e610c85', 100);
   */
  async addCashAtCustomer(customerId, updatedCash) {
    return await this.model.updateRewardByCustomerId(customerId, { cash: updatedCash });
  }

  /**
   * Subtrai valor monetário da recompensa de um cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente.
   * @param {number} updatedCash - Valor monetário a ser subtraído.
   * @returns {Promise<import('mongoose').Document|null>} Documento atualizado da recompensa ou null se não encontrado.
   * @example
   * const updatedReward = await rewardRepository.subtractCashAtCustomer('60d21b4667d0d8992e610c85', 50);
   */
  async subtractCashAtCustomer(customerId, updatedCash) {
    return await this.model.updateRewardByCustomerId(customerId, { cash: updatedCash });
  }

  /**
   * Obtém o valor monetário atual da recompensa de um cliente pelo ID do cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente para buscar o valor monetário.
   * @returns {Promise<number>} Valor monetário atual.
   * @example
   * const cash = await rewardRepository.getCurrentCashByCustomerId('60d21b4667d0d8992e610c85');
   */
  async getCurrentCashByCustomerId(customerId) {
    const reward = await this.model.getRewardByCustomerId(customerId);
    return reward.cash;
  }
}

export default RewardRepository;
