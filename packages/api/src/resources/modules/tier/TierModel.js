import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { TIER, CASHBACK } from '../../constants/index.js';
import Database from '../../../database/index.js';
import AppError from '../../../errors/AppError.js';

const TierSchema = {
  cashbackId: { type: Database.ObjectId, ref: CASHBACK, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  minPurchaseAmount: { type: Number, required: true },
  maxPurchaseAmount: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: function () {
      return this.discountType === 'percentage';
    },
  },
  discountFixedValue: {
    type: Number,
    required: function () {
      return this.discountType === 'fixed';
    },
  },
};

class TierModel extends Model {
  constructor() {
    super(TierSchema, TIER);
    this.model.schema.pre('validate', function (next) {
      if (this.minPurchaseAmount >= this.maxPurchaseAmount) {
        return next(new Error('minPurchaseAmount deve ser menor que maxPurchaseAmount'));
      }
      next();
    });
  }

  async create(tiersData) {
    try {
      debug.logger.info(`TierModel: criando a faixa de desconto com ${JSON.stringify(tiersData)}`);
      const createdTiers = await this.model.insertMany(tiersData);
      debug.logger.info(`TierModel: faixa(s) de desconto(s) criada: ${JSON.stringify(createdTiers)}`);
      return createdTiers;
    } catch (error) {
      debug.logger.error('TierModel: Erro ao criar faixa de desconto', error);
      throw new AppError(500, 'Erro ao criar múltplicas faixas');
    }
  }

  async findTiersByCashbackId(cashbackId) {
    try {
      debug.logger.info(`TierModel: buscando cashbackId:${cashbackId}`);
      const findTiersByCashbackId = await this.model.find({ cashbackId }).sort({ minPurchaseAmount: -1 });
      debug.logger.info(`TierModel: busca documentos de tiers bem-sucedida. ${findTiersByCashbackId}`);
      return findTiersByCashbackId;
    } catch (error) {
      debug.logger.warn(`TierModel: Erro ao acessar o banco de dados para buscar faixas de desconto`);
      throw new AppError(500, 'Erro ao acessar o banco de dados para buscar faixas de desconto');
    }
  }

  async updateTiersByCashbackId(cashbackId, tiersData) {
    try {
      debug.logger.info(`TierModel: Atualizando faixas de desconto para cashbackId:${cashbackId}`);
      const updatedTiers = await this.model.updateMany({ cashbackId }, tiersData, { new: true });

      if (!updatedTiers || updatedTiers.matchedCount === 0) {
        debug.logger.warn('Nenhum tier encontrado para o cashback durante a atualização', { cashbackId });
        throw new AppError(404, 'Nenhuma faixa de desconto encontrada para este cashback');
      }

      debug.logger.info(`TierModel: Atualização bem-sucedida para cashbackId:${cashbackId}`);
      return updatedTiers;
    } catch (error) {
      debug.logger.error('TierModel: Erro ao atualizar faixas de desconto', { cashbackId, error });
      throw new AppError(500, 'Erro ao acessar o banco de dados para atualizar faixas de desconto');
    }
  }
}

export default TierModel;
