import Model from '../../../core/entities/system/base/Model.js';
import loaders from '../../../core/loaders/index.js';
import { REWARD, CUSTOMER } from '../../collections/index.js';

/**
 * Esquema para o modelo de recompensa.
 *
 * @typedef {Object} RewardSchema
 * @property {import('mongoose').Types.ObjectId} customerId - ID do cliente vinculado à recompensa.
 * @property {number} points - Pontuação acumulada do cliente.
 * @property {number} cash - Valor monetário acumulado do cliente.
 */
const rewardSchema = {
  customerId: { type: loaders.mongoose.getObjectId(), ref: CUSTOMER, unique: true, required: true },
  points: { type: Number, required: true, default: 0 },
  cash: { type: Number, required: true, default: 0 },
};

/**
 * Classe para interação com o modelo de Recompensa no banco de dados.
 * Extende a classe base Model para herdar funcionalidades comuns.
 *
 * @class RewardModel
 */
class RewardModel extends Model {
  /**
   * Cria uma instância de RewardModel.
   */
  constructor() {
    super(rewardSchema, REWARD);
  }

  /**
   * Cria uma nova recompensa para o cliente especificado.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente para criar a recompensa.
   * @returns {Promise<import('mongoose').Document>} Documento do Mongoose representando a recompensa criada.
   * @example
   * const rewardModel = new RewardModel();
   * rewardModel.createReward('60d21b4667d0d8992e610c85');
   */
  async createReward(customerId) {
    return await this.model.create({ customerId, points: 0, cash: 0 });
  }

  /**
   * Obtém a recompensa associada a um cliente pelo ID do cliente.
   *
   * @param {import('mongoose').Types.ObjectId} customerId - O ID do cliente para buscar a recompensa.
   * @returns {Promise<import('mongoose').Document|null>} Documento da recompensa ou null se não encontrado.
   * @example
   * const reward = await rewardModel.getRewardByCustomerId('60d21b4667d0d8992e610c85');
   */
  async getRewardByCustomerId(customerId) {
    return await this.model.findOne({ customerId });
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
   * const updatedReward = await rewardModel.updateRewardByCustomerId('60d21b4667d0d8992e610c85', { points: 50 });
   */
  async updateRewardByCustomerId(customerId, updatedData) {
    return await this.model.findOneAndUpdate({ customerId }, updatedData, { new: true });
  }
}

export default RewardModel;
